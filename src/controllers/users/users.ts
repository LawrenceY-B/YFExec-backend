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
import csv from "csvtojson"
import moment from "moment";
import { importData, validateYouthMember } from "../../services/user.service";
import MemberData from "../../models/member.model";
import { IYouthMember } from "../../interfaces/youthMember";
import { writeData } from "../../middlewares/redis";
import cron from "node-cron";
import { sendBirthdayMail } from "../../services/auth.service";


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
    }: IYouthMember = req.body;

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

export const removeDuplicates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const duplicate = await MemberData.aggregate(
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
    if (duplicate.length > 0) {
      duplicate.forEach(async (doc) => {
        await MemberData.deleteMany({ _id: { $in: doc.dups } });

      });
      return res
        .status(200)
        .json({ success: true, message: "Duplicate removed" });
    }
    return res
      .status(200)
      .json({ success: true, message: "No duplicate found", data: duplicate });



  } catch (error) {
    next(error)
  }
}

export const uploadExcel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" })
    }
    const jsonArray = await csv().fromString(file.buffer.toString())
    let MemberData: IYouthMember[] = []
    for (const key in jsonArray) {
      let DoB = moment(jsonArray[key]['Date of birth'], 'DD/MM/YYYY')
      let otherName
      if (!jsonArray[key]['Other name(s)']) {
        otherName = null
      }
      let group = jsonArray[key]['What is the name of your Bible Study or Care Cell group?'];
      if (!group) {
        group = "None";
      }
      if (group === "N/A" || group === 'n/a') {
        group = "None"
      }
      let residence = jsonArray[key]['Residence'];
      if (!residence) {
        residence = "None"
      }
      let email = jsonArray[key]['Active email address']
      if (!email) {
        email = "None"
      }
      let phone = jsonArray[key]['Phone number']
      if (!phone) {
        phone = "None"
      }
      const formattedDate = DoB.toDate()
      const data: IYouthMember = {
        Firstname: jsonArray[key]['First name'],
        Othername: jsonArray[key]['Other name(s)'],
        Lastname: jsonArray[key]['Surname'],
        Email: email,
        Phonenumber: phone,
        DoB: formattedDate as Date,
        Gender: jsonArray[key]['Gender'],
        Residence: residence,
        BibleStudyCareCell: group,
        EmergencyContactName: jsonArray[key]['Who should be called in case of an emergency? (Name)'],
        EmergencyContact: jsonArray[key]['Contact of the person'],
        EmergencyContactRelationship: jsonArray[key]["What is the person's relation to you?"],
      };
      MemberData.push(data)


    }
    importData(res, MemberData)

    // fs.appendFile(
    //   "src/json/Members.json", JSON.stringify(MemberData, null, 2),
    //   (err) => {
    //     if (err) {
    //       res.status(400).send("Error writing file")
    //     } else {
    //       res.status(200).send(JSON.stringify(MemberData));
    //     }
    //   }
    // )
  }
  catch (err) {
    next(err)
  }
}

export const getMemberByFirstName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstname } = req.params
    if (!firstname) {
      return res.status(400).json({ success: false, message: "No search parameter" })
    }
    const member = await MemberData.find({ Firstname: firstname })
    if (!member || member.length === 0) {
      return res.status(400).json({ success: false, message: "No member found" })
    }
    writeData(firstname, JSON.stringify(member), {
      EX: 300
    })
    return res.status(200).json({ success: true, data: member })

  } catch (error) {
    next(error)
  }
}
export const findAllMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await MemberData.find({})
    if (!members) {
      return res.status(400).json({ success: false, message: "No member found" })
    }
    return res.status(200).json({ success: true, data: members })
  } catch (error) {
    next(error)
  }
}
export const searchMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body
    if (!data) {
      return res.status(400).json({ success: false, message: "No search parameter" })
    }
    const text = new RegExp(data as string, "i");

    const memberDetail = await MemberData.find({
      $or: [{ Firstname: text }, { Lastname: text }, { Othername: text }]

    })
    if (!memberDetail) {
      return res.status(400).json({ success: false, message: "No member found" })
    }
    return res.status(200).json({ success: true, data: memberDetail })
  } catch (error) {
    next(error)
  }
}
export const sendBirthdayWishes = async () => {
  try {
    cron.schedule("35 11 * * *", async () => {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const birthdayMatch = await MemberData.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $dayOfMonth: '$DoB' }, day] },
                { $eq: [{ $month: '$DoB' }, month] },
              ],
            },
          },
        },
      ]);
      if (birthdayMatch.length > 0) {
        birthdayMatch.forEach((member) => {
          const name = `${member.Firstname}  ${member.Lastname}`;
          sendBirthdayMail('lawrencekybj@gmail.com', name)
        });
      } else {
        console.log("No birthdays today");
      }
    })
  } catch (error) {
    console.log(error);
  }
}

