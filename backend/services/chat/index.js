import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/chat.routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
const port = process.env.PORT;

app.use("/", router);


app.listen(port, () => {
  connectDB()
  console.log(
    `🚀 Chat service is running on port ${port}`
  );
});
