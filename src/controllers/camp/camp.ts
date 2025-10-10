import { NextFunction, Request, Response } from "express";
import { ResponseCode } from "../../global/enums/response";
import { ICampFormPayload } from "../../interfaces/camp";
import { CampAttendeesData, campFormData } from "../../models/camp.model";
import { validateCampFormSubmission, validateCampYearAndType } from "../../services/camp.service";
import { sendBirthdayMail, sendMail, sendSMS } from "../../services/auth.service";
import { sendCampRegistrationConfirmation } from "../../utils/email.util";


export const getFormSchema = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, type } = req.params;

    const { error } = validateCampYearAndType(year, type);
    if (error) {
      res
        .status(400)
        .json({ success: false, responseCode: ResponseCode.VALIDATION_ERROR, message: error.details[0].message });
    }
    const form = await campFormData
      .findOne({ year: parseInt(year), formId: type, isActive: true })
      .select("schema year formId -_id");
    if (!form)
      return res.status(404).json({ success: false, responseCode: ResponseCode.NOT_FOUND, message: "Form not found" });
    const questions = { year: form.year, formId: form.formId, ...form.schema };
    res
      .status(200)
      .json({
        success: true,
        responseCode: ResponseCode.SUCCESS,
        message: "Form schema retrieved successfully",
        data: questions,
      });
  } catch (error) {
    next(error);
  }
};

export const submitCampForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, formId, details } = req.body as ICampFormPayload;

    const { error } = validateCampFormSubmission(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, responseCode: ResponseCode.VALIDATION_ERROR, message: error.details[0].message });
    }
    const form = await campFormData.findOne({ year: year, isActive: true });
    if (!form)
      return res
        .status(404)
        .json({
          success: false,
          responseCode: ResponseCode.NOT_FOUND,
          message: "Form not found for the specified year",
        });

    const firstName = details.firstName;
    const lastName = details.surname;
    const dob = details.dob;
    const existingSubmission = await CampAttendeesData.findOne({
      "details.firstName": firstName,
      "details.surname": lastName,
      "details.dob": dob,
      year: year,
      formId: formId,
    });
    if (existingSubmission) {
      return res
        .status(409)
        .json({
          success: false,
          responseCode: ResponseCode.CONFLICT,
          message: "Duplicate submission detected. A submission with the same name and date of birth already exists.",
        });
    }

    const newSubmission = new CampAttendeesData({
      year,
      formId,
      details,
    });
    const savedSubmission = await newSubmission.save();
    if (!savedSubmission)
      return res
        .status(500)
        .json({ success: false, responseCode: ResponseCode.BAD_REQUEST, message: "Failed to save form submission" });

    const isBelow18 = (() => {
      const age = details.age;
      if (age !== undefined) {
        return age < 18;
      }
      return false;
    })
    const message = isBelow18() ?
      `Dear ${details.firstName}, your registration for Youth Camp ${year} has been received. As you are below 18 years, we will need a consent form signed by your parent/guardian before you can attend the camp. We will contact you with further details.
      Kindly use this link to download the prospectus, rules and regulations, and consent form: http://bit.ly/48Xgpzk`
      : `Dear ${details.firstName}, your registration for Youth Camp ${year} has been received. We will contact you with further details.
      Kindly use this link to download the prospectus and rules and regulations: http://bit.ly/48Xgpzk`;
    const sms = await sendSMS(
      details.phoneNumber,
      message
    );
    if (!sms.success) {
      console.error("Failed to send SMS to", details.phoneNumber);
      console.error("Fallback: Sending confirmation email instead.");
      const emailSent = await sendCampRegistrationConfirmation(
        details.email,
        details.firstName,
        year,
        isBelow18()
      );
      if (!emailSent) {
        console.error("Failed to send confirmation email to", details.email);
      }
    }

    res.status(201).json({ success: true, message: "Form submitted successfully", data: savedSubmission, responseCode: ResponseCode.SUCCESS });
  } catch (error) {
    next(error);
  }
};
