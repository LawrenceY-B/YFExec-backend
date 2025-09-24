import { NextFunction, Request, Response } from "express";
import { ResponseCode } from "../../global/enums/response";
import campFormData from "../../models/camp.model";
import { validateCampYearAndType } from "../../services/camp.service";
/**
 * @todo return frontend form structure from db
 * @todo save form structure to db
 */

export const getFormSchema = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, type } = req.params;

    const { error } = validateCampYearAndType(year, type);
    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
    }
    const form = await campFormData
      .findOne({ year: parseInt(year), formId: type, isActive: true })
      .select("schema -_id");
    if (!form)
      return res.status(404).json({ success: false, responseCode: ResponseCode.NOT_FOUND, message: "Form not found" });
    res.status(200).json({ success: true, responseCode: ResponseCode.SUCCESS, data: form });
  } catch (error) {
    next(error);
  }
};
