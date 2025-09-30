import Joi from "joi";
import { ICampFormPayload } from "../interfaces/camp";

export const validateCampYearAndType = (year: string, type: string) => {
  const schema = Joi.object({
    year: Joi.number().integer().min(2000).max(2100).required(),
    type: Joi.string().valid("camp-registration").required(),
  });
  return schema.validate({ year, type });
};
export const validateCampFormSubmission = (data: ICampFormPayload) => {
  const schema = Joi.object({
    formId: Joi.string().valid("camp-registration").required(),
    year: Joi.number().integer().min(2000).max(2100).required(),
    details: Joi.object().required(),
  });
  return schema.validate(data);
};
