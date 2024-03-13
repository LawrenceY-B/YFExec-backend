import { Schema, model } from "mongoose";
import { IYouthMember } from "../interfaces/youthMember";

const members = new Schema<IYouthMember>({
    Firstname: { type: String, required: true },
    Lastname: { type: String, required: true },
    Email: { type: String, required: true },
    Phonenumber: { type: String, required: true },
    DoB: { type: Date, required:true},
    Gender: { type: String, required: true },
    Residence: { type: String, required: true },
    BibleStudyGroup: { type: String, required: true},
    CareCellName: { type: String, required: true}
})

const MemberData = model<IYouthMember>("members", members);

export default MemberData;