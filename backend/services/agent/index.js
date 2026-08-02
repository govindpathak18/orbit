import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

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
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-email', 'x-user-role', 'x-session-id', 'x-auth-token', 'x-access-token', 'Cookie'],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
const port = process.env.PORT;

app.use("/", router);

// global error
app.use((err, req, res, next) => {
  console.error(err);
  if (err.status) {
    return res
      .status(err.status)
      .json(err.data);
  }

  return res
    .status(500)
    .json({
      success: false,
      message: err.message || "Internal Server Error"
    });

});

app.listen(port, () => {
  connectDB()
  console.log(`🚀 Agent service is running on port ${port}`);
});
