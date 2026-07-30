import redis from "../../shared/redis/redis.js";

const DEFAULT_CREDITS = {
  Free: 100,
  Starter: 500,
  Pro: 1000,
};

const normalizeUser = (user) => {
  const plan = user.plan || "Free";
  const defaultCredits = DEFAULT_CREDITS[plan] ?? 100;

  return {
    ...user,
    plan,
    credits: typeof user.credits === "number" ? user.credits : defaultCredits,
    totalCredits: typeof user.totalCredits === "number" ? user.totalCredits : defaultCredits,
  };
};

// middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    const sessionId = req?.cookies?.session;

    if (!sessionId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    // check if session exists in redis
    const session = await redis.get(`session:${sessionId}`);

    if (!session) {
      return res.status(401).json({
        message: "Session Expired"
      });
    }

    // session === stringified user object,

    // attach user to request object
    req.user = normalizeUser(JSON.parse(session));

    next();

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }

}