import Joi from "joi";
import { Twilio } from "twilio";
import { IUser } from "../interfaces/IUser";
import { sendEmail, sendBirthdayMail as sendBirthdayMailUtil, sendOTPEmail } from "../utils/email.util";

export const generateOTP = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const otpLength = 6;
      const otpArray = new Uint8Array(otpLength);

      crypto.getRandomValues(otpArray);

      const OTP = otpArray.map((value) => value % 10).join("");

      resolve(OTP);
    } catch (error) {
      reject(error);
    }
  });
};
export const sendSMS = async (phone: string, text: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const MessageSID = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const client = new Twilio(accountSid, authToken);
  try {
    const message = await client.messages.create({
      body: `${text}`,
      messagingServiceSid: `${MessageSID}`,
      to: `${phone}`,
    });
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

export const sendMail = async (email: string, token: string, userid: string, name: string): Promise<void> => {
  try {
    await sendEmail({
      to: email,
      subject: "User Verification",
      template: "email",
      context: {
        name,
        token,
        userid,
      },
    });
  } catch (error) {
    throw error;
  }
};
export const sendMailOTP = async (email: string, otp: string, name: string) => {
  try {
    await sendOTPEmail(email, name, otp);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
export const sendBirthdayMail = async (email: string, name: string) => {
  try {
    await sendBirthdayMailUtil(email, name);
  } catch (error) {
    console.error("Error sending birthday email:", error);
  }
};

export const generateToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const token = crypto.randomUUID();
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};

export const ValidateSignUp = (person: IUser) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string().pattern(new RegExp("^(?:\\+233\\d{9}|0\\d{9})$")).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("ADMIN", "WELFARE", "USER").required(),
  });
  return schema.validate(person);
};
