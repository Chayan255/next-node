import db from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ For using __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 📰 Create News (with image upload)
 */
export const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "❌ Title and content are required." });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const sql =
      "INSERT INTO news (title, content, image_url) VALUES (?, ?, ?)";
    const [result] = await db.promise().query(sql, [title, content, image_url]);

    res.status(201).json({
      message: "✅ News created successfully",
      newsId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error creating news:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * 📜 Get all news (Public)
 */
export const getAllNews = async (req, res) => {
  try {
    const sql = "SELECT * FROM news ORDER BY created_at DESC";
    const [rows] = await db.promise().query(sql);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    res.status(500).json({ message: "Error fetching news", error });
  }
};

/**
 * 🧾 Get single news by ID
 */
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM news WHERE id = ?";
    const [rows] = await db.promise().query(sql, [id]);

    if (rows.length === 0)
      return res.status(404).json({ message: "News not found" });

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching single news:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * ✏️ Update News (with optional new image)
 */
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "❌ Title and content are required." });
    }

    // 🧠 If new image uploaded, replace it; otherwise keep old one
    const image_url = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image_url || null;

    const sql =
      "UPDATE news SET title = ?, content = ?, image_url = ? WHERE id = ?";
    await db.promise().query(sql, [title, content, image_url, id]);

    res.json({ message: "✅ News updated successfully" });
  } catch (error) {
    console.error("❌ Error updating news:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * 🗑️ Delete News (admin only)
 */
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    // Find image before deleting record
    const [result] = await db
      .promise()
      .query("SELECT image_url FROM news WHERE id = ?", [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "News not found" });
    }

    const imagePath = result[0].image_url;

    // Delete from DB
    await db.promise().query("DELETE FROM news WHERE id = ?", [id]);

    // Delete image file (if exists)
    if (imagePath) {
      const fullPath = path.join(__dirname, "..", imagePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.warn(
            "⚠️ Could not delete image file:",
            fullPath,
            err.message
          );
        } else {
          console.log("🧹 Deleted image file:", fullPath);
        }
      });
    }

    res.json({ message: "🗑️ News deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting news:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
