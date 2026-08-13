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
import cookieParser from "cookie-parser";

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

// --------------------
// CORS
// --------------------
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// --------------------
// Static files
// --------------------
app.use("/uploads", express.static("uploads"));

// --------------------
// Middlewares
// --------------------
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// --------------------
// Auth Service
// --------------------
// Frontend:
// POST /api/auth/login
//
// Gateway forwards:
// POST /api/auth/login
//
// Auth Service:
// app.use("/api/auth", router)
// router.post("/login", login)
app.use(
  "/api/auth",
  proxy(serviceUrls.auth, {
    proxyReqPathResolver: (req) => {
      return `/api/auth${req.url}`;
    },
  })
);

// --------------------
// Current User
// --------------------
app.use("/api/me", protect, getCurrentUser);

// --------------------
// Other Services
// --------------------
// Only authenticated users can access these services.
// User details are forwarded through headers.
app.use(
  "/api/chat",
  protect,
  proxyWithUser(serviceUrls.chat)
);

app.use(
  "/api/agent",
  protect,
  proxyWithUser(serviceUrls.agent)
);

app.use(
  "/api/billing",
  protect,
  proxyWithUser(serviceUrls.billing)
);

// --------------------
// Gateway Root
// --------------------
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Gateway is running smoothly",
    service: "gateway",
    status: "ok",
  });
});

// --------------------
// Health Check
// --------------------
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// --------------------
// Start Server
// --------------------
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Gateway running on ${port}`);
});