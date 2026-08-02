import crypto from "crypto";
import { getAuth } from "firebase-admin/auth";

import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";
import { app } from "../config/firebase.js";


// continue with google -> if user exists, create session and return user data
// else create user, create session and return user data
export const login = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = await getAuth(app).verifyIdToken(token);
    console.log(decoded);

    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) { // create new user
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture,
        provider: decoded.firebase?.sign_in_provider,
        plan: "Free",
        credits: 100,
        totalCredits: 100,
        planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    } else {
      let shouldSave = false;
      if (!user.plan) {
        user.plan = "Free";
        shouldSave = true;
      }
      if (typeof user.credits !== "number") {
        user.credits = 100;
        shouldSave = true;
      }
      if (typeof user.totalCredits !== "number") {
        user.totalCredits = 100;
        shouldSave = true;
      }
      if (!user.planExpiresAt) {
        user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        shouldSave = true;
      }
      if (shouldSave) {
        await user.save();
      }
    }


    // create session and return user data
    const sessionId = crypto.randomUUID();

    // store session in redis with user data
    await redis.set(
      `user-session:${user._id}`,
      sessionId,
      "EX",
      60 * 60 * 24 * 7
    );

    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user._id,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
      }),
      "EX",
      60 * 60 * 24 * 7
    );

    return res.json({
      success: true,
      user,
      sessionId,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};


// delete session from redis using the bearer token
export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const sessionId = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    if (sessionId) {
      const sessionData = await redis.get(`session:${sessionId}`);

      if (sessionData) {
        try {
          const parsedSession = JSON.parse(sessionData);
          if (parsedSession?.userId) {
            await redis.del(`user-session:${parsedSession.userId}`);
          }
        } catch {
          // ignore malformed session payloads
        }
      }

      await redis.del(`session:${sessionId}`);
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// updates user plan
export const updatePlan = async (req, res) => {
  try {
    const { userId, plan, credits } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.plan = plan;
    user.credits += credits;
    user.totalCredits += credits;
    user.planExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    await user.save(); // updated in db

    // update the redis store
    const sessionId = await redis.get(`user-session:${user._id}`);

    if (sessionId) {
      await redis.set(
        `session:${sessionId}`,
        JSON.stringify({
          userId: user._id,
          email: user.email,
          avatar: user.avatar,
          name: user.name,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
        }),
        "EX",
        60 * 60 * 24 * 7
      );
    }

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// deducts credits from user
export const deductCredits = async (req, res) => {
  try {
    const { userId, agent } = req.body;

    // cost of each service
    const COST = {
      chat: 1,
      search: 5,
      coding: 10,
      pdf: 10,
      ppt: 10,
      image: 10,
    };

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // credit used
    const requiredCredits = COST[agent] || 1;

    // not enough credits to use the service
    if (user.credits < requiredCredits) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits.",
      });
    }

    user.credits -= requiredCredits;
    await user.save();

    const sessionId = await redis.get(`user-session:${user._id}`);

    // update the session in redis
    if (sessionId) {
      await redis.set(
        `session:${sessionId}`,
        JSON.stringify({
          userId: user._id,
          email: user.email,
          avatar: user.avatar,
          name: user.name,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits,
        }),
        "EX",
        60 * 60 * 24 * 7
      );
    }

    return res.json({
      success: true,
      credits: user.credits,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};