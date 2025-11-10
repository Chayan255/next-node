import express from "express";
import multer from "multer";
import path from "path";
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import { verifyAdminToken } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// ===============================
// 🧠 Multer Storage Configuration
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Images will be stored here
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

// ✅ Optional: File type validation
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only JPEG, PNG, JPG, WEBP files are allowed"), false);
  }
};

// 📦 Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ===============================
// 🔓 PUBLIC ROUTES
// ===============================

// Get all news (public)
router.get("/", getAllNews);

// Get single news by ID (public)
router.get("/:id", getNewsById);

// ===============================
// 🔐 ADMIN PROTECTED ROUTES
// ===============================

// ✅ Create news (with image upload)
router.post("/", verifyAdminToken, upload.single("image"), createNews);

// ✅ Update news (with optional new image)
router.put("/:id", verifyAdminToken, upload.single("image"), updateNews);


// ✅ Delete news
router.delete("/:id", verifyAdminToken, deleteNews);

// ✅ Export router (important for ESM)
export default router;
