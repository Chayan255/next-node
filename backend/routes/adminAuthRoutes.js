import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminAuthController.js";

const router = express.Router();

// 🧠 Routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// ✅ Default export — this line is VERY important!
export default router;
