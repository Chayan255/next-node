import express from "express";
import db from "../config/db.js";

const router = express.Router();

/**
 * 🧠 Test API — to verify DB and server connectivity
 */
router.get("/test", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT NOW() AS currentTime");
    res.status(200).json({
      message: "✅ API Working!",
      serverTime: rows[0].currentTime,
    });
  } catch (error) {
    console.error("❌ Database test route error:", error);
    res.status(500).json({ message: "Database connection error", error });
  }
});

export default router;
