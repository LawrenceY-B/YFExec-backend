import { NextFunction, Request, Response } from "express";
import { ResponseCode } from "../../global/enums/response";
import { CampAttendeesData, campFormData } from "../../models/camp.model";
import { validateCampFormSubmission, validateCampYearAndType } from "../../services/camp.service";
import { ICampFormPayload } from "../../interfaces/camp";
/**
 * @todo return frontend form structure from db
 * @todo save form structure to db
 */

export const getFormSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { year, type } = req.params;

        const { error } = validateCampYearAndType(year, type);
        if (error) {
            res.status(400).json({ success: false, responseCode: ResponseCode.VALIDATION_ERROR, message: error.details[0].message });
        }
        const form = await campFormData
            .findOne({ year: parseInt(year), formId: type, isActive: true })
            .select("schema year formId -_id");
        if (!form)
            return res.status(404).json({ success: false, responseCode: ResponseCode.NOT_FOUND, message: "Form not found" });
        const questions = { year: form.year, formId: form.formId, ...form.schema };
        res.status(200).json({ success: true, responseCode: ResponseCode.SUCCESS, message: "Form schema retrieved successfully", data: questions });
    } catch (error) {
        next(error);
    }
};

export const submitCampForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { year, formId, details } = req.body as ICampFormPayload;

        const { error } = validateCampFormSubmission(req.body);
        if (error) {
            return res.status(400).json({ success: false, responseCode: ResponseCode.VALIDATION_ERROR, message: error.details[0].message });
        }
        const form = await campFormData
            .findOne({ year: year, isActive: true });
        if (!form) return res.status(404).json({ success: false, responseCode: ResponseCode.NOT_FOUND, message: "Form not found for the specified year" });

        //check for duplicate submission based on unique fields like name and dob
        const firstName = details.firstName;
        const lastName = details.surname;
        const dob = details.dob; 
        const existingSubmission = await CampAttendeesData.findOne({
            "details.firstName": firstName,
            "details.surname": lastName,
            "details.dob": dob,
            year: year,
            formId: formId
        });
        if (existingSubmission) {
            return res.status(409).json({ success: false, responseCode: ResponseCode.CONFLICT, message: "Duplicate submission detected. A submission with the same name and date of birth already exists." });
        }

        const newSubmission = new CampAttendeesData({
            year,
            formId,
            details,
        });
        const savedSubmission = await newSubmission.save();
        if (!savedSubmission) return res.status(500).json({ success: false, responseCode: ResponseCode.BAD_REQUEST, message: "Failed to save form submission" });

        res.status(201).json({ success: true, message: "Form submitted successfully", data: savedSubmission });
    } catch (error) {
        next(error);
    }
};
