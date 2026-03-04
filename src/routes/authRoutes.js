import express from "express";
import { login, register } from "../controllers/authController.js";
import { createRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  keyPrefix: "auth",
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

export default router;
