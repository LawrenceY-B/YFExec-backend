import Joi from "joi";
import { IUser } from "../interfaces/IUser";
import { Twilio } from "twilio";

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

  client.messages
    .create({
      body: `${text}`,
      messagingServiceSid: `${MessageSID}`,
      to: `${phone}`,
    })
    .then((message) => console.log(message.status))
    .catch((error) => console.error(error));
};
export const ValidateSignUp = (person: IUser) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    phone: Joi.string()
      .pattern(new RegExp("^(?:\\+233\\d{9}|0\\d{9})$"))
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
    role: Joi.string().valid("ADMIN", "WELFARE", "USER").required(),
  });
  return schema.validate(person);
};
