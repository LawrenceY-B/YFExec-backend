export interface IFormSchema {
  formId: string;
  year: number;
  schema: CampFormSchema;
  isActive: boolean;
}
export interface CampFormSchema {
  formTitle: string;
  description?: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
}

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "datetime"
  | "radio"
  | "checkbox"
  | "multiselect"
  | "email"
  | "tel";

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  description?: string;
  options?: string[];
  link?: string;
}
