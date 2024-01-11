import express from "express";
import { register, verify } from "../contollers/authentication/auth";

const AuthRoutes = express.Router();

AuthRoutes.post('/register', register)
AuthRoutes.get('/verify', verify )


export default AuthRoutes;