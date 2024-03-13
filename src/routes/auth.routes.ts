import express, { Request, Response } from "express";
import {
  getALLUsers,
  login,
  register,
  resetPassword,
  signinwithEmail,
  signinwithPhone,
  verify,
  verifyOTP,
} from "../contollers/authentication/auth";
import OTPData from "../models/otp.model";

const AuthRoutes = express.Router();

AuthRoutes.post("/register", register);
AuthRoutes.post("/reset", resetPassword);
AuthRoutes.get("/verify", verify);
AuthRoutes.post("/signin-phone", signinwithPhone);
AuthRoutes.post("/signin-email", signinwithEmail);
AuthRoutes.post("/signin-password", login);
AuthRoutes.get("/getusers", getALLUsers);
AuthRoutes.post("/verify-otp", verifyOTP);
// AuthRoutes.get('/otpfetcher', async (req:Request, res:Response)=>{
//     try {
//         const {userid}=req.body
//         const data = await OTPData.findOne({user_id:userid})
//         if(!data){
//             res.status(400).json({success:false, message:"OTP not found"})
//         }
//         res.status(200).json({success:true, message:"OTP found", data:data})

//     } catch (error) {
//         res.status(500).json({success:false, message:"Something went wrong"})
//     }

// })

export default AuthRoutes;
