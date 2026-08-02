import express from "express";

import {
    deductCredits,
    login,
    logout,
    updatePlan
}
    from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/login", login);

const requireSession = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const fallbackHeader = req.headers["x-session-id"] || req.headers["x-auth-token"] || req.headers["x-access-token"];

    const sessionId = typeof authHeader === "string" && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7).trim()
        : typeof fallbackHeader === "string"
            ? fallbackHeader.trim()
            : null;

    if (!sessionId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    next();
};

router.post("/logout", requireSession, logout);
router.get("/logout", requireSession, logout);

router.patch("/internal/update-plan", updatePlan);

router.patch("/internal/deduct-credits", deductCredits);


export default router;