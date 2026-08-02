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

router.post("/logout", (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    next();
}, logout);
router.get("/logout", (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    next();
}, logout);

router.patch("/internal/update-plan", updatePlan);

router.patch("/internal/deduct-credits", deductCredits);


export default router;