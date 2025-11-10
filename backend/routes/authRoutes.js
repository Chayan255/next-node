// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// ✅ Login route (will handle guestCart merge)
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
