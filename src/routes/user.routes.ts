import { Router } from "express";
import {
  addMember,
  editMembers,
  removeDuplicates,
} from "../contollers/users/users";

const UserRoutes = Router();

UserRoutes.post("/add", addMember);
UserRoutes.put("/update", editMembers);
UserRoutes.get("/get", removeDuplicates);

export default UserRoutes;
