import express from "express";
import { register } from "../contollers/authentication/auth";

const AuthRoutes = express.Router();

AuthRoutes.post('/register', register)


export default AuthRoutes;