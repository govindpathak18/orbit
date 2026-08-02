import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import redis from "../shared/redis/redis.js";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import { proxyWithUser } from "./utils/proxyWithHeaders.js";
import { protect } from "./middlewares/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import cookieParser from "cookie-parser"
dotenv.config();
const app = express();
const port = process.env.PORT || 5000
app.set("trust proxy", 1);

const parseOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
  ...parseOrigins(process.env.CORS_ORIGINS),
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-user-email", "x-user-role", "Cookie"],
    exposedHeaders: ["set-cookie"],
    optionsSuccessStatus: 204,
  })
);

app.use(
  "/uploads",
  express.static("uploads")
);


// middlewares
app.use(helmet()); // security headers
app.use(morgan("dev")); // logs fetched api's 
app.use(cookieParser()); // parse cookies
app.use(express.json()); // parse json



// services (auth, chat, agent, billing) are proxied through the gateway
app.use("/api/auth", proxy(process.env.AUTH_SERVICE))
app.use("/api/me", protect, getCurrentUser)


// only authenticated users can access other services
// user details are send to those services using headers(proxyWithUser middleware)
app.use("/api/chat", protect, proxyWithUser(process.env.CHAT_SERVICE))
app.use("/api/agent", protect, proxyWithUser(process.env.AGENT_SERVICE))
app.use("/api/billing", protect, proxyWithUser(process.env.BILLING_SERVICE))


app.get("/", (req, res) => {
  res.status(200).json({
    "message": "Gateway is running smoothly",
    service: "gateway",
    status: "ok"
  });
});


app.listen(port, () => {
  console.log(`🚀 Gateway running on ${port}`);
});
