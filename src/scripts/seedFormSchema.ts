import dotenv from "dotenv";
import mongoose from "mongoose";
import { campFormData } from "../models/camp.model";

dotenv.config();

async function seed() {
    try {
        const DB_URL = process.env.DB_URL;
        await mongoose.connect(`${DB_URL}`, {});
        const formId = "camp-registration";
        const year = 2026;

        const schema = {
            formTitle: "LIC Camp 2026 Registration Form",
            description: "Please fill out this form to register for the LIC Youth Camp 2026.",
            sections: [
                {
                    id: "personalInfo",
                    title: "Personal Information",
                    description: "For all attendees - We need this information to reach you.",
                    fields: [
                        { id: "timestamp", label: "Timestamp", type: "datetime" },
                        { id: "firstName", label: "First Name", type: "text", required: true },
                        { id: "surname", label: "Surname", type: "text", required: true },
                        { id: "otherNames", label: "Other Name(s)", type: "text" },
                        { id: "gender", label: "Gender", type: "radio", options: ["Male", "Female"] },
                        { id: "dob", label: "Date of Birth", type: "date" },
                        { id: "age", label: "Age", type: "number" },
                        { id: "phoneNumber", label: "Phone Number", type: "tel", required: true },
                        { id: "whatsappNumber", label: "WhatsApp Number", type: "tel" },
                        { id: "email", label: "Active Email Address", type: "email" },
                    ],
                },
                {
                    id: "campInfo",
                    title: "Camp Information",
                    description: "For all attendees - We need this information to plan effectively for the camp.",
                    fields: [
                        {
                            id: "firstTime",
                            label: "Would this be your first time attending LIC camp?",
                            type: "radio",
                            options: ["Yes", "No"],
                        },
                        {
                            id: "availability",
                            label: "On what days will you be available to participate at Camp?",
                            description:
                                "Buses will be available at LIC to convey campers to the Camp site only on Thursday, 1st January, 2026 and return to LIC on Sunday, 4th January, 2026.",
                            type: "multiselect",
                            options: ["All the days", "1st January, 2026", "2nd January, 2026", "3rd January, 2026"],
                        },
                        {
                            id: "conditions",
                            label: "Do you have any condition(s) that require monitoring and medication?",
                            description: "(E.g.; asthma, high blood pressure, diabetes, etc.)",
                            type: "radio",
                            options: ["Yes", "No"],
                        },
                        { id: "conditionDetails", label: "If yes, kindly state the condition.", type: "text" },
                        {
                            id: "allergies",
                            label: "Any allergies?",
                            description:
                                "(E.g.; lactose intolerant, pineapple, gluten sensitivity, dust, reaction to chloroquine, etc.).",
                            type: "radio",
                            options: ["Yes", "No"],
                        },
                        { id: "allergyDetails", label: "If yes, kindly state allergy.", type: "text" },
                    ],
                },
                {
                    id: "emergencyInfo",
                    title: "Emergency Contact",
                    description:
                        "For all attendees - In case of an emergency, we may need to reach out to someone on your behalf.",
                    fields: [
                        { id: "emergencyName", label: "Who should be called in case of an emergency? (Name)", type: "text" },
                        {
                            id: "emergencyRelation",
                            label: "What is their relation to you?",
                            description: "E.g.; Parent, Guardian, Sibling, etc.",
                            type: "text",
                        },
                        { id: "emergencyContact", label: "Contact Number", type: "tel" },
                    ],
                },
                {
                    id: "expectations",
                    title: "Expectations & Questions",
                    description:
                        "For all attendees - what are your expectations for camp and do you have any questions about the Bible?",
                    fields: [
                        { id: "expectation", label: "What is your expectation for Camp 2026?", type: "textarea" },
                        { id: "bibleQuestion", label: "What question do you have about the Bible?", type: "textarea" },
                    ],
                },
                {
                    id: "licYFDatabase",
                    title: "LIC Youth Fellowship Database Update",
                    description:
                        "This section is to be filled by LIC Youth Fellowship members only for the purposes of our database.",
                    fields: [
                        {
                            id: "homeChurch",
                            label: "Which church do you belong to?",
                            type: "radio",
                            options: ["LIC", "Other"],
                            required: true,
                        },
                        { id: "otherChurch", label: "If 'Other', specify church name", type: "text" },
                        {
                            id: "occupation",
                            label: "Occupation",
                            description: "Eg. Student, Worker (state your role/designation) etc.",
                            type: "text",
                        },
                        {
                            id: "workplace",
                            label: "Place of Occupation",
                            description: "Eg. Company Name, School Name etc.",
                            type: "text",
                        },
                        { id: "residence", label: "Residence", type: "text" },
                        {
                            id: "cellGroup",
                            label: "Select the groups you belong to",
                            type: "multiselect",
                            options: ["Bible Study", "Care Cell", "Area Fellowship"],
                        },
                        { id: "bibleStudyGroupName", label: "Bible Study Group Name", type: "text" },
                        { id: "careCellGroupName", label: "Care Cell Group Name", type: "text" },
                        { id: "areaFellowshipName", label: "Area Fellowship Name", type: "text" },
                        {
                            id: "isMember",
                            label: "Are you a regularized (Full) member of LIC?",
                            type: "radio",
                            options: ["Yes", "No", "Not Sure"],
                        },
                    ],
                },
                {
                    id: "agreements",
                    title: "Agreements & Support",
                    description:
                        "For all attendees - Please read and agree to the declaration and provide any additional information as required.",
                    fields: [
                        {
                            id: "declaration",
                            label:
                                "I hereby declare that I will abide by the rules and regulations governing the camp and shall be willing to help in every way possible to make camp 2026 a success.",
                            type: "checkbox",
                            options: ["Yes, I do"],
                        },
                        {
                            id: "comments",
                            label: "Any comments or concerns? (Eg. transportation, requisition)",
                            type: "textarea",
                        },
                        {
                            id: "support",
                            label: "Do you require support in paying for camp?",
                            type: "radio",
                            options: ["Yes", "No"],
                        },
                        { id: "supportAmount", label: "If yes, how much?", type: "number" },
                        {
                            id: "whatsappGroup",
                            label: "Have you joined the WhatsApp group for Camp 2026?",
                            type: "radio",
                            options: ["Yes", "No"],
                            description: "Please join the WhatsApp group via this link.",
                            link: "https://chat.whatsapp.com/H9iPMyxCDi471D2LO11RvT",
                        },
                    ],
                },
            ],
        };

        await campFormData.deleteMany({ formId, year });

        const form = new campFormData({
            formId,
            year,
            schema,
            isActive: true,
        });

        await form.save();
        console.log("✅ Form schema seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding form schema:", err);
        process.exit(1);
    }
}

seed();
