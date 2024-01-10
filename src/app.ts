import express, { Response, Request, NextFunction } from "express";
import { createServer } from "http";
import "dotenv/config";
import { DB_Connection } from "./database/db";
import ErrorHandler from "./middlewares/ErrorHandler";
import AuthRoutes from "./routes/auth.routes";

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
      "Content-Type, Authorization"
    );
    next();
  })
  .use("/api/auth", AuthRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});
app.use(ErrorHandler);

const httpserver = server.listen(port, async () => {
  await DB_Connection();
  console.log(`server is running on port ${port}`);
});
