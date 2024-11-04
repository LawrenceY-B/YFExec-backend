import express, { Response, Request, NextFunction } from "express";
import { createServer } from "http";
import "dotenv/config";
import { DB_Connection } from "./database/db";
import ErrorHandler from "./middlewares/ErrorHandler";

// import { initiateClient } from "./middlewares/redis";
import AuthRoutes from "./routes/auth.routes";
import UserRoutes from "./routes/user.routes";
import { sendBirthdayWishes } from "./controllers/users/users";




const port = process.env.PORT;
const app = express();
const server = createServer(app);
app.use(express.json());

app
  .use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    next();
  })
  .use("/api/members", UserRoutes)
  .use("/api/v1/admin/auth", AuthRoutes);

app.all("*", (req, res) => {
  const userUrl = req.url;
  res.status(404).json({ message: "Page Not Found", url: userUrl });
});
app.use(ErrorHandler);

const httpserver = server.listen(port, async () => {
  await DB_Connection();
  // await initiateClient()
  sendBirthdayWishes()
  console.log(`server is running on port ${port}`);
});
