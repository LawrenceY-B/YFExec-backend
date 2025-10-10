import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";

interface EmailOptions {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
    templatePath?: string; // Optional custom template path
}

export const sendEmail = async (options: EmailOptions) => {
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

    // Use custom template path or default to ./src/views/
    const viewPath = options.templatePath || "./src/views/";

    const handlebarOptions: NodemailerExpressHandlebarsOptions = {
        viewEngine: {
            extname: ".hbs",
            partialsDir: viewPath,
            layoutsDir: viewPath,
            defaultLayout: `${options.template}.hbs`,
        },
        viewPath: viewPath,
        extName: ".hbs",
    };

    transporter.use("compile", hbs(handlebarOptions));

    const mailOptions = {
        from: process.env.EMAIL,
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                console.error("Email sending error:", error);
                reject(error);
            } else {
                console.info("Email sent:", info.response);
                resolve(info);
            }
        });
    });
};

// Specific email functions using the generic service
export const sendBirthdayMail = async (email: string, name: string, templatePath?: string) => {
    return await sendEmail({
        to: email,
        subject: `🎉 Happy Birthday, ${name}! 🎈 May God Bless Your Year Ahead!`,
        template: "birthday",
        context: { name },
        templatePath: templatePath || "./src/views/",
    });
};


export const sendCampRegistrationConfirmation = async (
    email: string,
    firstName: string,
    year: number,
    isMinor: boolean = false,
    templatePath?: string
) => {
    return await sendEmail({
        to: email,
        subject: `Youth Camp ${year} - Registration Confirmation`,
        template: "camp-confirmation",
        context: {
            firstName,
            year,
            isMinor
        },
        templatePath: templatePath || "./src/views/",
    });
};

export const sendOTPEmail = async (email: string, name: string, otp: string, templatePath?: string) => {
    return await sendEmail({
        to: email,
        subject: "Your OTP Verification Code",
        template: "otp",
        context: { name, otp },
        templatePath: templatePath || "./src/views/",
    });
};