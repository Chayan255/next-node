import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🔐 Verify User Token Middleware
 * Used for regular logged-in users (not admin)
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // ✅ Check Bearer token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");

    // ✅ Optional: Role restriction (only for user, not admin)
    if (decoded.role && decoded.role !== "user") {
      return res
        .status(403)
        .json({ message: "Access denied. Only users allowed here." });
    }

    // ✅ Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "user",
    };

    next(); // Continue to controller
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    return res.status(403).json({ message: "Invalid or malformed token." });
  }
};
