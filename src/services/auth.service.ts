import Joi from "joi";
import { IUser } from "../interfaces/IUser";
import { Twilio } from "twilio";
import nodemailer from "nodemailer";
import hbs, {
  NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";

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
    .then((message) => console.info(message.status))
    .catch((error) => console.error(error));
};

export const sendMail = async (
  email: string,
  token: string,
  userid: string,
  name: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const user = process.env.EMAIL as string;
      const pass = process.env.PASSWORD as string;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${user}`,
          pass: `${pass}`,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const handlebarOptions: NodemailerExpressHandlebarsOptions = {
        viewEngine: {
          extname: ".hbs",
          partialsDir: "./src/views/",
          layoutsDir: "./src/views/",
          defaultLayout: "email.hbs",
        },
        viewPath: "./src/views/",
        extName: ".hbs",
      };

      transporter.use("compile", hbs(handlebarOptions));

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "User Verification",
        template: "email",
        context: {
          name,
          token,
          userid,
        },
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          console.info("Email sent:", info.response);
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const sendMailOTP = async (email: string, otp: string, name: string) => {
  const user = process.env.EMAIL as string;
  const pass = process.env.PASSWORD as string;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${user}`,
      pass: `${pass}`,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const handlebarOptions: NodemailerExpressHandlebarsOptions = {
    viewEngine: {
      extname: ".hbs",
      partialsDir: "./src/views/",
      layoutsDir: "./src/views/",
      defaultLayout: "otp.hbs",
    },
    viewPath: "./src/views/",
    extName: ".hbs",
  };

  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "User Verification",
    template: "otp",
    context: {
      name,
      otp,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.info("Email sent:", info.response);
    }
  });
};
export const sendBirthdayMail = async (email:string, name:string) => {
  const user = process.env.EMAIL as string;
  const pass = process.env.PASSWORD as string;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${user}`,
      pass: `${pass}`,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const handlebarOptions: NodemailerExpressHandlebarsOptions = {
    viewEngine: {
      extname: ".hbs",
      partialsDir: "./src/views/",
      layoutsDir: "./src/views/",
      defaultLayout: "birthday.hbs",
    },
    viewPath: "./src/views/",
    extName: ".hbs",
  };

  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `🎉 Happy Birthday, ${name}! 🎈 May God Bless Your Year Ahead!`,
    template: "birthday",
    context: {
      name,
    },
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.info("Email sent:", info.response);
    }
  });
}

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
    phone: Joi.string()
      .pattern(new RegExp("^(?:\\+233\\d{9}|0\\d{9})$"))
      .required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("ADMIN", "WELFARE", "USER").required(),
  });
  return schema.validate(person);
};
