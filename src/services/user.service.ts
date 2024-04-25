import Joi from "joi";
import { IYouthMember } from "../interfaces/youthMember";
import { Response } from "express";
import MemberData from "../models/member.model";

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
export const importData = async (res: Response, data: IYouthMember[]) => {
  try {
    await MemberData.insertMany(data);
    res.status(200).json({ success: true, message: "Data imported" });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};
