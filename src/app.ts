import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { DB_Connection } from "./database/db";
import ErrorHandler from "./middlewares/ErrorHandler";
import cors from "cors";


// import { initiateClient } from "./middlewares/redis";
import { sendBirthdayWishes } from "./controllers/users/users";
import AuthRoutes from "./routes/auth.routes";
import CampRoutes from "./routes/camp.routes";
import UserRoutes from "./routes/user.routes";

const port = process.env.PORT;
const app = express();
const server = createServer(app);
app.use(express.json());

app.use(cors({
  origin: "*", // In production, specify your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app
  .use("/api/members", UserRoutes)
  .use("/api/camp", CampRoutes)
  .use("/api/v1/admin/auth", AuthRoutes);

app.all("*", (req, res) => {
  const userUrl = req.url;
  res.status(404).json({ message: "Page Not Found", url: userUrl });
});
app.use(ErrorHandler);

const httpserver = server.listen(port, async () => {
  await DB_Connection();
  // await initiateClient()
  sendBirthdayWishes();
  console.log(`server is running on port ${port}`);
});
