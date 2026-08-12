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
const port = process.env.PORT || 8000;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
].filter(Boolean);
const serviceUrls = {
  auth: process.env.AUTH_SERVICE_URL || process.env.AUTH_SERVICE,
  chat: process.env.CHAT_SERVICE_URL || process.env.CHAT_SERVICE,
  agent: process.env.AGENT_SERVICE_URL || process.env.AGENT_SERVICE,
  billing: process.env.BILLING_SERVICE_URL || process.env.BILLING_SERVICE,
};
app.set("trust proxy", 1);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}))

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
app.use("/api/auth", proxy(serviceUrls.auth))
app.use("/api/me", protect, getCurrentUser)


// only authenticated users can access other services
// user details are send to those services using headers(proxyWithUser middleware)
app.use("/api/chat", protect, proxyWithUser(serviceUrls.chat))
app.use("/api/agent", protect, proxyWithUser(serviceUrls.agent))
app.use("/api/billing", protect, proxyWithUser(serviceUrls.billing))


app.get("/", (req, res) => {
  res.status(200).json({
    "message": "Gateway is running smoothly",
    service: "gateway",
    status: "ok"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Gateway running on ${port}`);
});
