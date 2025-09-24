import { Response } from "express";
import Joi from "joi";
import * as XLSX from "xlsx";
import { IYouthMember } from "../interfaces/youthMember";
import MemberData from "../models/member.model";

export const validateYouthMember = (youthMember: IYouthMember) => {
  const schema = Joi.object({
    Firstname: Joi.string().required(),
    Othername: Joi.string().allow(null),
    Lastname: Joi.string().required(),
    Email: Joi.string().email().required(),
    Phonenumber: Joi.string().pattern(new RegExp("^(?:\\+233\\d{9}|0\\d{9})$")).required(),
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
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ success: false, message: "No data provided" });
    }
    await MemberData.insertMany(data, { ordered: false });
    return res.status(200).json({ success: true, message: "Data imported successfully" });
  } catch (error: any) {
    console.error("Import error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong while importing data",
    });
  }
};

export const convertXLSXtoCSV = async (file: Express.Multer.File) => {
  try {
    if (!file) throw new Error("No file provided");
    if (!file.originalname.match(/\.(xlsx|xls)$/)) throw new Error("Invalid file format. Please upload an XLSX file.");
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    return csvData;
  } catch (error) {
    throw new Error("Error converting XLSX to CSV");
  }
};

const calcAge = (dob: string) => {
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const generateExcelWithStats = (data: IYouthMember[]): Buffer => {
  const totalMembers = data.length;
  const totalMales = data.filter((m) => m.Gender?.toLowerCase() === "male").length;
  const totalFemales = data.filter((m) => m.Gender?.toLowerCase() === "female").length;

  const ageGroups: Record<string, number> = {};
  data.forEach((m) => {
    const age = calcAge(m.DoB as string);
    if (age !== null) {
      let bucket = "";
      if (age <= 12) bucket = "0-12";
      else if (age <= 15) bucket = "13-15";
      else if (age <= 20) bucket = "16-20";
      else if (age <= 25) bucket = "21-25";
      else if (age <= 30) bucket = "26-30";
      else bucket = "30+";
      ageGroups[bucket] = (ageGroups[bucket] || 0) + 1;
    }
  });

  // Residence
  const residenceCounts: Record<string, number> = {};
  data.forEach((m) => {
    const r = m.Residence && m.Residence !== "None" ? m.Residence : "Unknown";
    residenceCounts[r] = (residenceCounts[r] || 0) + 1;
  });

  // Care Cells
  const careCellCounts: Record<string, number> = {};
  data.forEach((m) => {
    const c = m.BibleStudyCareCell && m.BibleStudyCareCell !== "None" ? m.BibleStudyCareCell : "None";
    careCellCounts[c] = (careCellCounts[c] || 0) + 1;
  });

  // Workbook
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Members
  const dataSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, dataSheet, "Members");

  // Sheet 2: Statistics
  const statsData: any[] = [
    { Metric: "Total Members", Value: totalMembers },
    { Metric: "Total Males", Value: totalMales },
    { Metric: "Total Females", Value: totalFemales },
    {},
    { Metric: "Age Groups", Value: "" },
    ...Object.entries(ageGroups).map(([group, count]) => ({ Metric: group, Value: count })),
    {},
    { Metric: "Residence Counts", Value: "" },
    ...Object.entries(residenceCounts).map(([res, count]) => ({ Metric: res, Value: count })),
    {},
    { Metric: "Bible Study Care Cells", Value: "" },
    ...Object.entries(careCellCounts).map(([cell, count]) => ({ Metric: cell, Value: count })),
  ];

  const statsSheet = XLSX.utils.json_to_sheet(statsData);
  XLSX.utils.book_append_sheet(workbook, statsSheet, "Statistics");

  // Return as buffer
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};
