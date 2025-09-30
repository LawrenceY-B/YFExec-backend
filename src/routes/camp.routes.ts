import { Router } from "express";
const CampRoutes = Router();

import { getFormSchema, submitCampForm } from "../controllers/camp/camp";

CampRoutes.get("/get-questions/:year/:type", getFormSchema);
CampRoutes.post("/submit", submitCampForm);

export default CampRoutes;
