import { Schema, model } from "mongoose";
import { IFormSchema } from "../interfaces/camp";

const CampFormSchema = new Schema<IFormSchema>({
  formId: { type: String, required: true },
  year: { type: Number, required: true },
  schema: { type: Object, required: true },
  isActive: { type: Boolean, default: true },
});

const campFormData = model<IFormSchema>("youthCampForms", CampFormSchema);
export default campFormData;
