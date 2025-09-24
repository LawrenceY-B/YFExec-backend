import Joi from "joi";

export const validateCampYearAndType = (year: string, type: string) => {
  const schema = Joi.object({
    year: Joi.number().integer().min(2000).max(2100).required(),
    type: Joi.string().valid("camp-registration").required(),
  });
  return schema.validate({ year, type });
};
