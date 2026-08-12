import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("REDIS_URL is not configured");
}

console.log("Connecting to Redis using REDIS_URL");

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