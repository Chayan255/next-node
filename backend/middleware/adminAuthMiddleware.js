import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🔐 Verify Admin Token Middleware
 * Ensures:
 *  1️⃣ Valid JWT token exists
 *  2️⃣ Token belongs to an admin
 *  3️⃣ Admin exists in database
 */
export const verifyAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // 🧠 Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");

    // ✅ Optional: Check token type
    if (decoded.type && decoded.type !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Not an admin account!" });
    }

    // ✅ Verify admin exists in DB
    const [result] = await db
      .promise()
      .query("SELECT id, name, email FROM admins WHERE id = ?", [decoded.id]);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid or removed admin user." });
    }

    // 🧩 Attach admin data to request
    req.admin = result[0];

    next(); // ✅ Proceed to controller
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};
