import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

//this module extends Request to create a new object, in this case, the user object
declare module "express-serve-static-core" {
  interface Request {
    user: {
      mongoID: Schema.Types.ObjectId;
      userId: string;
      name: string;
      email: string;
      phone: string;
      role: string;
      iat: number;
      exp: number;
    };
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Authorization = req.get("Authorization");
  if (!Authorization || !Authorization.startsWith("Bearer ")) {
    res.status(401).json({ message: "Invalid Authorization header" });
    console.warn("Invalid Authorization header");
  }

  const token: string = Authorization!.split(" ")[1];
  try {
    const payload: any = jwt.verify(token, process.env.JWTSECRETKEY || "");

    if (!payload) {
      res.status(401).json({ message: "Invalid access token" });
      console.warn("Invalid access token");
    }

    if (payload.exp < Date.now() / 1000) {
      res.status(401).json({ message: "Token has expired" });
      console.warn("Token has expired");
    }
    req.user = payload;
    next();
  } catch (error) {
    next(error);
    console.warn(error);
  }
};
