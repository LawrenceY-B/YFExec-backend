import Joi from "joi";
import { IYouthMember } from "../interfaces/youthMember";

export const validateYouthMember = (youthMember: IYouthMember) => {
  const schema = Joi.object({
    Firstname: Joi.string().required(),
    Othername: Joi.string().allow(null),
    Lastname: Joi.string().required(),
    Email: Joi.string().email().required(),
    Phonenumber: Joi.string()
      .pattern(new RegExp("^(?:\\+233\\d{9}|0\\d{9})$"))
      .required(),
    DoB: Joi.date().required(),
    Gender: Joi.string().required(),
    Residence: Joi.string().required(),
    BibleStudyCareCell: Joi.string().allow(null),
    EmergencyContactName: Joi.string().required(),
    EmergencyContactRelationship: Joi.string().required(),
    EmergencyContact: Joi.string().required(),
  });
  return schema.validate(youthMember);
};
