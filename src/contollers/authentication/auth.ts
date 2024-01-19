import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../../interfaces/IUser";
import UserData from "../../models/user.model";
import { v4 as uuidv4, validate } from "uuid";
import {
  ValidateSignUp,
  generateOTP,
  sendSMS,
  sendMail,
  generateToken,
  sendMailOTP,
} from "../../services/auth.service";
import OTPData from "../../models/otp.model";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = ValidateSignUp(req.body);
    if (error) {
      res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const { name, email, phone, role } = req.body;
    let phonenumber = phone as string;
    if (phonenumber.startsWith("0")) {
      phonenumber = phonenumber.replace("0", "+233");
    }
    const u = await UserData.find({
      $or: [{ phone: phonenumber }, { email: email }],
    });
    if (u.length >= 1)
      return res
        .status(403)
        .json({ success: false, message: "Phone already in use" });
    const key = await generateToken();
    let token = key;
    const user: IUser = {
      name: name,
      email: email,
      password: null,
      phone: phonenumber,
      role: role,
      user_id: uuidv4(),
      isVerified: false,
      verificationToken: token,
    };

    const newUser = new UserData(user);
    let userid = newUser.user_id;
    const saveUser = await newUser.save();
    if (!saveUser)
      res.status(400).json({ success: false, message: "user not saved" });

    // const text = `Your verification code is ${otp}.\n\nThis password will expire in 5 minutes.\n\n`;
    // sendSMS(phonenumber, text);
    sendMail(email, token, userid, name);
    res.status(200).json({ success: true, message: "user saved" });
  } catch (error) {
    next(error);
  }
};
export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, userid } = req.query;
    if (!token || !userid)
      return res.status(400).json({ success: false, message: "invalid token" });

    const user = await UserData.findOne({ user_id: userid });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User Does Not Exist" });
    if (user.isVerified)
      return res
        .status(400)
        .json({ success: true, message: "User Already Verified" });
    let update = {
      isVerified: true,
      verificationToken: null,
    };

    const verification = await UserData.findOneAndUpdate(
      {
        user_id: userid,
        verificationToken: token,
      },
      update,
      { new: true }
    );
    if (!verification)
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong" });
    const data = {
      email: verification.email,
      user_id: verification.user_id,
      isVerified: verification.isVerified,
    };

    res
      .status(200)
      .json({ success: true, message: "user verified", data: data });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserData.findOne({email: email  });
    if (!user)
      return res.status(400).json({ success: false, message: "User does not exist" });
    const validPassword = await bcrypt.compare(password, user.password as string);
    if (!validPassword)
      return res.status(400).json({ success: false, message: "Wrong Password" });
    if (!user.isVerified)
      return res.status(400).json({ success: false, message: "User not verified" });

    const secret = process.env.JWTSECRETKEY as string;
    const token = jwt.sign(
      {
        mongoID: user._id,
        userId: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      `${secret}`,
      { expiresIn: "12h",
      algorithm: 'HS512'}
    );
  
    res.status(200).json({ success: true, message: "user logged in", data:token });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userid, password } = req.body;
    if (!userid || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing details ‼️" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const update = {
      password: hashedPassword,
    };
    const reset = await UserData.findOneAndUpdate({ user_id: userid }, update, {
      new: true,
    });
    if (!reset)
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong" });
    console.log(reset);
    res
      .status(200)
      .json({ success: true, message: "Password Reset Successful" });
  } catch (error) {
    next(error);
  }
};
export const signinwithPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone } = req.body;
    let phonenumber = phone as string;
    if (phonenumber.startsWith("0")) {
      phonenumber = phonenumber.replace("0", "+233");
    }
    const user = await UserData.findOne({ phone: phonenumber });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Phone number does not exist" });

    const otp = await generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 12);

    const newOTP = new OTPData({
      user_id: user.user_id,
      otp: hashedOTP,
    });
    const saveOTP = await newOTP.save();
    if (!saveOTP)
      res.status(400).json({ success: false, message: "OTP not saved" });

    const text = `Your verification code is ${otp}.\n\nThis password will expire in 5 minutes.\n\n`;
    await sendSMS(phonenumber, text);
    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error) {
    next(error);
  }
};
export const signinwithEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await UserData.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Phone number does not exist" });

    const otp = await generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 12);

    const newOTP = new OTPData({
      user_id: user.user_id,
      otp: hashedOTP,
    });
    const saveOTP = await newOTP.save();
    if (!saveOTP)
      res.status(400).json({ success: false, message: "OTP not saved" });
    sendMailOTP(email, otp, user.name);
    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error) {
    next(error);
  }
};

export const getALLUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserData.find().select("name email phone user_id");
    if (!users)
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong" });
    res
      .status(200)
      .json({ success: true, message: "users found", data: users });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const secret = process.env.JWT_SECRET as string;
    const { userid, otp } = req.body;
    if (!userid || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Missing details ‼️" });
    const findOTP = await OTPData.findOne({ user_id: userid });
    if (!findOTP)
      return res.status(400).json({ success: false, message: "OTP Expired" });
    const validOTP = await bcrypt.compare(otp, findOTP.otp);
    if (!validOTP)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    const user = await UserData.findOne({ user_id: userid });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User Does Not Exist" });
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      `${secret}`,
      { expiresIn: "12h",
      algorithm: 'HS512'}
    );

    return res
      .status(200)
      .json({ success: true, message: "OTP Verified", data: token });
  } catch (error) {
    next(error);
  }
};
