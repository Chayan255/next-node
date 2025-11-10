import express from "express";
import {
  addOrUpdateCart, // ✅ renamed for clarity
  getCart,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

// ➕ Add or update item in cart
router.post("/", addOrUpdateCart);

// 🧺 Get user cart by user_id
router.get("/:user_id", getCart);

// ❌ Remove item from cart by user_id + product_id
router.delete("/:user_id/:product_id", removeFromCart);

export default router;
