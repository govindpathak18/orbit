import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/chat.routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const allowedOrigins = [
  process.env.CORS_ORIGINS,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
].filter(Boolean);

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-email', 'x-user-role', 'Cookie'],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
const port = process.env.PORT;

app.use("/", router);


app.listen(port, () => {
  connectDB()
  console.log(
    `🚀 Chat service is running on port ${port}`
  );
});
