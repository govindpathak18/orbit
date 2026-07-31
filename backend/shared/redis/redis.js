import fs from "fs";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const isContainer = fs.existsSync("/.dockerenv");
const redisUrl = process.env.REDIS_URL || (isContainer ? "redis://redis:6379" : "redis://127.0.0.1:6379");

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

export default redis;