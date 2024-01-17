import express from "express";
import { getALLUsers, register, resetPassword, signinwithEmail, signinwithPhone, verify, verifyOTP } from "../contollers/authentication/auth";

const AuthRoutes = express.Router();

AuthRoutes.post('/register', register)
AuthRoutes.post('/reset', resetPassword )
AuthRoutes.get('/verify', verify )
AuthRoutes.post('/signin-phone', signinwithPhone)
AuthRoutes.post('/signin-email', signinwithEmail)
AuthRoutes.get('/getusers', getALLUsers)
AuthRoutes.post('/verify-otp', verifyOTP)


export default AuthRoutes;