import { Schema, model } from "mongoose";

const OTPSchema = new Schema(
  {
    user_id: { type: String },
    otp: { type: String, required: true },
    createdAt: { type: Date, expires: 300, default: Date.now },
  },
  { timestamps: true },
);

const OTPData = model("otp", OTPSchema);
export default OTPData;
