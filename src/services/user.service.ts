import Joi from "joi";
import { IYouthMember } from "../interfaces/youthMember";

export const validateYouthMember = (youthMember: IYouthMember) => {
  const schema = Joi.object({
    Firstname: Joi.string().required(),
    Lastname: Joi.string().required(),
    Email: Joi.string().email().required(),
    Phonenumber: Joi.string()
      .pattern(new RegExp("^(?:\\+233\\d{9}|0\\d{9})$"))
      .required(),
    DoB: Joi.date().required(),
    Gender: Joi.string().required(),
    Residence: Joi.string().required(),
    BibleStudyGroup: Joi.string().allow(null),
    CareCellName: Joi.string().allow(null),
  });
  return schema.validate(youthMember);
};
