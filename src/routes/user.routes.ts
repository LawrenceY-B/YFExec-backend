import { Router } from "express";
import multer from "multer"
import {
  addMember,
  editMembers,
  removeDuplicates, uploadExcel,
} from "../contollers/users/users";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const UserRoutes = Router();

UserRoutes.post("/add", addMember);
UserRoutes.put("/update/:id", editMembers);
UserRoutes.get("/get", removeDuplicates);
UserRoutes.post("/upload", upload.single('file'), uploadExcel);

export default UserRoutes;
