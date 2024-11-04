import { Router } from "express";
import multer from "multer"
import { addMember, editMembers, findAllMembers, getMemberByFirstName, removeDuplicates, searchMembers, uploadExcel } from "../controllers/users/users";
// import { checkCache } from "../middlewares/redis";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const UserRoutes = Router();

UserRoutes.post("/add", addMember);
UserRoutes.put("/update/:id", editMembers);
UserRoutes.get("/remove-duplicates", removeDuplicates);
UserRoutes.post("/upload", upload.single('file'), uploadExcel);
UserRoutes.get("/get-all", findAllMembers);
// UserRoutes.get("/get/:firstname", checkCache ,getMemberByFirstName)
UserRoutes.get("/get/:firstname", getMemberByFirstName)
UserRoutes.get("/search",searchMembers)

export default UserRoutes;
