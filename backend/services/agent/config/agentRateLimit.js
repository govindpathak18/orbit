import redis from "../../../shared/redis/redis.js";

// rate limits per minute for different agents
const LIMITS = {
  chat: 20,
  coding: 5,
  pdf: 5,
  ppt: 5,
  image: 3,
  search: 5
};

export const checkAgentLimit = async (userId, agent) => {

  const max = LIMITS[agent] ?? LIMITS.chat;

  const key = `rate:${agent}:${userId}`;

  // Increment the count for the key in Redis evry time a request is made
  const count = await redis.incr(key);

  // Set the expiration time for the key to 60 seconds if it's the first request
  if (count === 1) {
    await redis.expire(key, 60);
  }

  // Get the remaining time to live (TTL) for the key
  const ttl = await redis.ttl(key);

  // If the count exceeds the limit, throw an error with the remaining time
  if (count > max) {
    const minutes = Math.floor(ttl / 60);
    const seconds = ttl % 60;

    const time = minutes > 0
        ? `${minutes}m ${seconds}s`
        : `${seconds}s`;

    const error = new Error(
      `Rate limit exceeded for ${agent}.`
    );

    error.status = 429;

    error.data = {
      success: false,
      agent,
      limit: max,
      remainingTime: ttl,
      retryAfter: time,
      message: `You have reached the ${agent} limit (${max} requests/minute). Try again in ${time}.`
    };

    throw error;
  }

  return {
    remaining: max - count,
    limit: max
  };
};