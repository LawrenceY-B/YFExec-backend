import { Router } from "express";
const CampRoutes = Router();

import { getFormSchema } from "../controllers/camp/camp";

CampRoutes.get("/get-questions/:year/:type", getFormSchema);

export default CampRoutes;
