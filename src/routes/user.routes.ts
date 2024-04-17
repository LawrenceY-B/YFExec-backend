import { Router } from "express";
import {
  addMember,
  editMembers,
  removeDuplicates, uploadExcel,
} from "../contollers/users/users";

const UserRoutes = Router();

UserRoutes.post("/add", addMember);
UserRoutes.put("/update/:id", editMembers);
UserRoutes.get("/get", removeDuplicates);
UserRoutes.get("/upload", uploadExcel);

export default UserRoutes;
