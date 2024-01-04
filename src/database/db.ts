import mongoose from "mongoose";


export const DB_Connection = async () => {
  const DB_URL = process.env.DB_URL
    mongoose
    .connect(`${DB_URL}`, {})
    .then(() => {
      console.log("MongoDB connected!!");
    })
    .catch((err: Error) => {
      console.error("Failed to connect to MongoDB", err);
    });
};



