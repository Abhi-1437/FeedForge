// Summary routes
import express from "express";
import { getSummary } from "../controllers/summary.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { summaryRateLimit } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/", summaryRateLimit, getSummary);

export default router;