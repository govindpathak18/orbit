import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redis = new Redis(redisUrl, {
  connectTimeout: 10000,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) {
      return null;
    }
    return Math.min(times * 100, 2000);
  },
});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

let redisErrorLogged = false;
redis.on("error", (error) => {
  if (!redisErrorLogged) {
    redisErrorLogged = true;
    console.error("Redis error:", error);
  }
});

export default redis;