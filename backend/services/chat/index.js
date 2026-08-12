import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/chat.routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
const port = process.env.PORT || 8002;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/", router);


app.listen(port, "0.0.0.0", () => {
  connectDB()
  console.log(
    `🚀 Chat service is running on port ${port}`
  );
});
