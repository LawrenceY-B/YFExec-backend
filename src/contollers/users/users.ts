/*use role-based access control (rbac) only head of Welfare and welfare members can add add new members to the database 
1. Data to be stored = [Firstname, Lastname, Email, Phonenumber, Date of Birth, Gender, Area of Residence, Bible Study Group or Care Cell Name]
2. Head of Welfare can view and edit all members in the database. Members can only edit after approval from Head of Welfare.
3. Upload an Excel file to add multiple members to the database.
4. Remove duplicate members from the database.
5. Search for members in the database
6. Send birthday wishes to members on their birthday.
7. Send email to Head of Welfare reminding them about youth members birthday.
*/

import { Request, Response, NextFunction } from "express";
import { validateYouthMember } from "../../services/user.service";
import MemberData from "../../models/member.model";
import { IYouthMember } from "../../interfaces/youthMember";

export const addMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = validateYouthMember(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const {
      Firstname,
        Othername,
      Lastname,
      Email,
      Phonenumber,
      DoB,
      Gender,
      Residence,
      BibleStudyCareCell,
        EmergencyContactName,
        EmergencyContact,
        EmergencyContactRelationship,
    } = req.body;
    console.log(req.body);

    const existingMember = await MemberData.findOne({
      Firstname: Firstname,
      Lastname: Lastname,
      Email: Email,
      Phonenumber: Phonenumber,
      DoB: DoB,
    });
    if (existingMember) {
      return res
        .status(400)
        .json({ success: false, message: "Member already exists" });
    }
    let group = BibleStudyCareCell;

    if (!BibleStudyCareCell) {
      group = "None";
    }
    if (!EmergencyContactName || !EmergencyContact || !EmergencyContactRelationship) {
        return res.status(400).json({
            success: false,
            message: "Emergency contact details are required",
        });
    }

    const data: IYouthMember = {
      Firstname,
        Othername,
      Lastname,
      Email,
      Phonenumber,
      DoB,
      Gender,
      Residence,
      BibleStudyCareCell: group,
        EmergencyContactName,
        EmergencyContact,
        EmergencyContactRelationship,

    };
    const newMember = new MemberData(data);
    const saveMember = await newMember.save();
    if (!saveMember) {
      return res.status(400).json({
        success: false,
        message: "Couldn't save member details",
      });
    }
    return res.status(200).json({
      data: saveMember,
    });
  } catch (error) {
    next(error);
  }
};
export const editMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    console.log(req.params.id);
    const {
      Firstname,
        Othername,
      Lastname,
      Email,
      Phonenumber,
      DoB,
      Gender,
      Residence,
      BibleStudyCareCell,
        EmergencyContactName,
        EmergencyContact,
        EmergencyContactRelationship,
    }:IYouthMember = req.body;

    const member = await MemberData.findOne({ _id: id });
    if (!member) {
      return res
        .status(400)
        .json({ success: false, message: "Member not found" });
    }
    const update = {
      Firstname,
        Othername,
      Lastname,
      Email,
      Phonenumber,
      DoB,
      Gender,
      Residence,
      BibleStudyCareCell,
        EmergencyContactName,
        EmergencyContact,
        EmergencyContactRelationship,
    };

    const updatedMember = await MemberData.findOneAndUpdate(
      { _id: id },
      update,
      { new: true },
    );
    if (!updatedMember) {
      return res
        .status(400)
        .json({ success: false, message: "Couldn't update member" });
    }
    return res.status(200).json({
      success: true,
      message: "User updated !!!",
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

export const removeDuplicates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const duplicates = await MemberData.aggregate(
      [
        {
          $group: {
            _id: {
              Firstname: "$Firstname",
              Lastname: "$Lastname",
              Email: "$Email",
              Phonenumber: "$Phonenumber",
              DoB: "$DoB",
            },
            dups: { $push: "$_id" },
            count: { $sum: 1 },
          },
        },
        {
          $match: {
            count: { $gt: 1 },
          },
        },
      ],
      { allowDiskUse: true },
    ).exec();
    if (duplicates.length > 0) {
      duplicates.map(async (doc) => {
        await MemberData.deleteMany({ _id: { $in: doc.dups } });
        return res
          .status(200)
          .json({ success: true, message: "Duplicates removed" });
      });
    }else{
      return res.status(200).json({success:true, message:"No duplicates found"})
    }

  } catch (error) {
    {
      next(error);
    }
  }
};

export const uploadExcel = async (req:Request, res:Response, next:NextFunction) => {
  try{
    const file = req.file
    if(!file){
      return res.status(400).json({success:false, message:"No file uploaded"})
    }


  }catch (error) {
    next(error)
  }
}
