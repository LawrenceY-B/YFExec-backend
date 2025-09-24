import { Schema, model } from "mongoose";
import { IYouthMember } from "../interfaces/youthMember";

const members = new Schema<IYouthMember>({
  Firstname: { type: String, required: true },
  Othername: { type: String },
  Lastname: { type: String, required: true },
  Email: { type: String, required: true },
  Phonenumber: { type: String, required: true },
  DoB: { type: Date, required: true },
  Gender: { type: String, required: true },
  Residence: { type: String, required: true },
  BibleStudyCareCell: { type: String, required: true },
  EmergencyContactName: { type: String, required: true },
  EmergencyContactRelationship: { type: String, required: true },
  EmergencyContact: { type: String, required: true },
});

const MemberData = model<IYouthMember>("members", members);

export default MemberData;
