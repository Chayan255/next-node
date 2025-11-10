// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import multer from "multer";

// // ✅ Import DB & Routes
// import db from "./config/db.js";
// import testRoute from "./routes/testRoute.js";
// import authRoutes from "./routes/authRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import newsRoutes from "./routes/newsRoutes.js";
// import adminAuthRoutes from "./routes/adminAuthRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";

// // ✅ Load environment variables
// dotenv.config();

// const app = express();

// // =========================
// // 🔧 Middleware Configuration
// // =========================
// app.use(
//   cors({
//     origin: "*", // ✅ You can restrict this later to your Vercel domain
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); // ✅ Support for form-data

// // 🧠 Required for __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ Ensure "uploads" folder exists automatically
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
//   console.log("📁 'uploads' folder created automatically.");
// }

// // ✅ Serve static files from uploads
// app.use("/uploads", express.static(uploadDir));

// // =========================
// // 🧩 API Routes
// // =========================
// app.use("/api", testRoute);
// app.use("/api/auth", authRoutes);
// app.use("/api/order", orderRoutes);
// app.use("/api/news", newsRoutes);
// app.use("/api/admin", adminAuthRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);

// // =========================
// // 🖼️ Multer Configuration for Image Uploads
// // =========================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
//     cb(null, safeName);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // ✅ 5MB limit
//   fileFilter: (req, file, cb) => {
//     const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//     if (allowed.includes(file.mimetype)) cb(null, true);
//     else cb(new Error("❌ Only image files are allowed (JPEG, PNG, WEBP)."));
//   },
// });

// // ✅ Upload route for News Images
// app.post("/api/news/upload", upload.single("image"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No image uploaded." });
//     }

//     // 🌐 Detect environment (local or live)
//     const baseUrl =
//       process.env.BASE_URL || `https://node-next-backend.up.railway.app`; // fallback live URL
//     const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

//     res.status(200).json({
//       success: true,
//       message: "✅ Image uploaded successfully.",
//       imageUrl,
//     });
//   } catch (error) {
//     console.error("❌ Upload error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error during upload." });
//   }
// });

// // =========================
// // 🩺 Test DB connection
// // =========================
// try {
//   db.connect?.((err) => {
//     if (err) console.error("❌ Database Connection Error:", err);
//     else console.log("✅ MySQL Connected Successfully!");
//   });
// } catch (error) {
//   console.error("⚠️ DB Connection Skipped:", error.message);
// }

// // =========================
// // 🚀 Start Server
// // =========================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📸 Uploads available at /uploads`);
// });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";

// ✅ Import DB & Routes
import db from "./config/db.js";
import testRoute from "./routes/testRoute.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

// ✅ Load environment variables
dotenv.config();

const app = express();

// =========================
// 🔧 Middleware Configuration
// =========================
app.use(
  cors({
    origin: [
      "https://next-node-liard.vercel.app", // ✅ তোমার Vercel frontend domain
      "http://localhost:3000",               // ✅ লোকাল টেস্টের সময় কাজ করবে
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🧠 For ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 'uploads' folder created automatically.");
}

// ✅ Serve static uploads
app.use("/uploads", express.static(uploadDir));

// =========================
// 🧩 API Routes
// =========================
app.use("/api", testRoute);
app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// =========================
// 🖼️ Multer Configuration (Image Uploads)
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("❌ Only image files are allowed (JPEG, PNG, WEBP)."));
  },
});

// ✅ Upload route for News Images
app.post("/api/news/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    const baseUrl =
      process.env.BASE_URL || "https://next-node-backend.onrender.com";
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "✅ Image uploaded successfully.",
      imageUrl,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during upload.",
    });
  }
});

// =========================
// 🩺 Test DB connection (Neon)
// =========================
(async () => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("🧠 DB Connected — Current Time:", result.rows[0].now);
  } catch (err) {
    console.error("❌ Neon DB Connection Error:", err.message);
  }
})();

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT COUNT(*) FROM news");
    res.json({ success: true, totalNews: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =========================
// 🚀 Start Server
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📸 Uploads available at /uploads`);
});
