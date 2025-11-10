import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { verifyAdminToken } from "../middleware/adminAuthMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

// Initialize router
const router = express.Router();

// 🧠 Required for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});

// ✅ File Type Validation (Optional)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only JPEG, PNG, JPG, WEBP files are allowed"), false);
  }
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ===============================
// 🔓 PUBLIC ROUTES
// ===============================
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// ===============================
// 🔐 ADMIN PROTECTED ROUTES
// ===============================
router.post("/", verifyAdminToken, upload.single("image"), createProduct);
router.put("/:id", verifyAdminToken, upload.single("image"), updateProduct);
router.delete("/:id", verifyAdminToken, deleteProduct);

// Export router
export default router;
