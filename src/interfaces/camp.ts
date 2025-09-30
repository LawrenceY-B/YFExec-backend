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
export interface ICampAttendeeDetails {
    timestamp?: string;
    firstName: string;
    surname: string;
    otherNames?: string;
    gender: "Male" | "Female";
    age?: number;
    phoneNumber: string;
    whatsappNumber?: string;
    dob: string;
    email?: string;
    firstTime: "Yes" | "No";
    availability: string[];
    conditions: "Yes" | "No";
    conditionDetails?: string;
    allergies: "Yes" | "No";
    allergyDetails?: string;
    emergencyName: string;
    emergencyRelation: string;
    emergencyContact: string;
    expectation: string;
    bibleQuestion?: string;
    homeChurch: string;
    occupation?: string;
    workplace?: string;
    residence?: string;
    cellGroup: ("Bible Study" | "Care Cell" | "Area Fellowship")[];
    bibleStudyGroupName?: string;
    careCellGroupName?: string;
    areaFellowshipName?: string;
    isMember: "Yes" | "No";
    declaration: ["Yes"];
    comments?: string;
    support: "Yes" | "No";
    supportAmount?: number;
    whatsappGroup: "Yes" | "No";
}

export interface ICampFormPayload {
    formId: string;
    year: number;
    details: ICampAttendeeDetails;
    submittedAt?: Date;
}