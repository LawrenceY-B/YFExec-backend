import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, default: null },
    role: { type: String, required: true },
    user_id: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, required: true },
  },
  { timestamps: true },
);

const UserData = model<IUser>("users", UserSchema);

export default UserData;
