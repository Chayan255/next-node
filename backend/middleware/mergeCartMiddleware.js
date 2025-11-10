// middleware/mergeCartMiddleware.js
import db from "../config/db.js";

export const mergeGuestCart = async (req, res, next) => {
  try {
    const { guestCart } = req.body; // frontend থেকে পাঠানো guestCart array
    const userId = req.user?.id; // JWT decoded user info from authMiddleware

    if (!guestCart || !Array.isArray(guestCart) || guestCart.length === 0) {
      return next(); // যদি কিছু না থাকে → skip
    }

    console.log("🛒 Merging guest cart for user:", userId);

    // Loop করে guestCart merge করো
    for (const item of guestCart) {
      const [existing] = await db
        .promise()
        .query(
          "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
          [userId, item.id]
        );

      if (existing.length > 0) {
        // already আছে → quantity update করো
        await db
          .promise()
          .query(
            "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
            [item.quantity || 1, userId, item.id]
          );
      } else {
        // নতুন insert করো
        await db
          .promise()
          .query(
            "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
            [userId, item.id, item.quantity || 1]
          );
      }
    }

    console.log("✅ Guest cart merged successfully");
    next();
  } catch (err) {
    console.error("❌ Cart merge failed:", err);
    next(); // fail করলেও login process চলবে
  }
};
