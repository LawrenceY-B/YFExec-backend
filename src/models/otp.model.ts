import { Schema, model } from "mongoose";

const OTPSchema = new Schema(
  {
    user_id: { type: String },
    otp: { type: String, required: true},
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
},
  { timestamps: true }
);

const OTPData = model("otp", OTPSchema);
export default OTPData;