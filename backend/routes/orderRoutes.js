import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🛒 Place Order (Login Required)
 */
router.post("/add", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total_amount } = req.body;

    if (!items || !total_amount) {
      return res.status(400).json({ message: "Missing order details." });
    }

    const sql =
      "INSERT INTO orders (user_id, items, total_amount) VALUES (?, ?, ?)";
    await db.promise().query(sql, [userId, JSON.stringify(items), total_amount]);

    res.status(201).json({ message: "✅ Order placed successfully." });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ message: "Order failed", error });
  }
});

/**
 * 📦 Get logged-in user’s orders
 */
router.get("/myorders", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    const [orders] = await db.promise().query(sql, [userId]);

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

export default router;
