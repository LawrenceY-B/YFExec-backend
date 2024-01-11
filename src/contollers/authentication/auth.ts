import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import { IUser } from "../../interfaces/IUser";
import UserData from "../../models/user.model";
import { v4 as uuidv4, validate } from "uuid";
import {
  ValidateSignUp,
  generateOTP,
  sendSMS,
  sendMail,
  generateToken,
} from "../../services/auth.service";

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
    const { name, email, password, phone, role } = req.body;
    let phonenumber = phone as string;
    if (phonenumber.startsWith("0")) {
      phonenumber = phonenumber.replace("0", "+233");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const u = await UserData.find({
      $or: [{ phone: phonenumber }, { email: email }],
    });
    if (u.length >= 1)
      return res
        .status(403)
        .json({ success: false, message: "Phone already in use" });
    const key = generateToken();
    let token = (await key).toString();
    const user: IUser = {
      name: name,
      email: email,
      password: hashedPassword,
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

     const user = await UserData.findOne({ user_id: userid})
     if(!user) return res.status(400).json({ success: false, message: "User Does Not Exist"});
     if(user.isVerified) return res.status(400).json({ success: true, message: "User Already Verified"});      
      let update = {
          isVerified: true,
          verificationToken: null,
      };
      
      const verification = await UserData.findOneAndUpdate({
        user_id: userid ,
        verificationToken: token ,
      }, update, { new: true });
    if (!verification)
      return res.status(400).json({ success: false, message: "Something went wrong" });

    res.status(200).json({ success: true, message: "user verified", data:verification });
  } catch (error) {
    next(error);
  }
};
