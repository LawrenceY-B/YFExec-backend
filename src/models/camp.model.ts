import { Schema, model } from "mongoose";
import { ICampFormPayload, IFormSchema } from "../interfaces/camp";

const CampFormSchema = new Schema<IFormSchema>({
    formId: { type: String, required: true },
    year: { type: Number, required: true },
    schema: { type: Object, required: true },
    isActive: { type: Boolean, default: true },
});

const campFormData = model<IFormSchema>("youthCampForms", CampFormSchema);

const CampAttendeesSchema = new Schema<ICampFormPayload>({
    formId: { type: String, required: true },
    year: { type: Number, required: true },
    details: { type: Object, required: true },
    submittedAt: { type: Date, default: Date.now },
});

const CampAttendeesData = model<ICampFormPayload>("youthCampAttendees", CampAttendeesSchema);

export { campFormData, CampAttendeesData };
