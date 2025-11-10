import db from "../config/db.js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Base URL for images
const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

/**
 * 🟢 Create Product
 */
export const createProduct = (req, res) => {
  const { name, description, price } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !price)
    return res.status(400).json({ message: "Name and price are required" });

  const sql =
    "INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, description, price, image_url], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });

    res.status(201).json({
      message: "✅ Product added successfully",
      id: result.insertId,
    });
  });
};

/**
 * 🟡 Get All Products
 */
export const getAllProducts = (req, res) => {
  const sql = "SELECT * FROM products ORDER BY created_at DESC";
  db.query(sql, (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error fetching products", error: err });

    // ✅ Convert relative URLs to full URLs
    const products = rows.map((p) => ({
      ...p,
      image_url: p.image_url
        ? p.image_url.startsWith("http")
          ? p.image_url
          : `${BASE_URL}${p.image_url}`
        : null,
    }));

    res.json(products);
  });
};

/**
 * 🔵 Get Single Product
 */
export const getProductById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM products WHERE id=?";

  db.query(sql, [id], (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error fetching product", error: err });
    if (rows.length === 0)
      return res.status(404).json({ message: "Product not found" });

    const product = rows[0];
    if (product.image_url && !product.image_url.startsWith("http")) {
      product.image_url = `${BASE_URL}${product.image_url}`;
    }

    res.json(product);
  });
};

/**
 * 🟠 Update Product
 */
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

  const sql =
    "UPDATE products SET name=?, description=?, price=?, image_url=? WHERE id=?";
  db.query(sql, [name, description, price, image_url, id], (err) => {
    if (err)
      return res.status(500).json({ message: "Error updating product", error: err });
    res.json({ message: "✅ Product updated successfully" });
  });
};

/**
 * 🔴 Delete Product
 */
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  const findSql = "SELECT image_url FROM products WHERE id=?";

  db.query(findSql, [id], (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error finding product", error: err });
    if (rows.length === 0)
      return res.status(404).json({ message: "Product not found" });

    const filePath = rows[0].image_url
      ? path.join(path.resolve(), rows[0].image_url)
      : null;

    const delSql = "DELETE FROM products WHERE id=?";
    db.query(delSql, [id], (err2) => {
      if (err2)
        return res.status(500).json({ message: "Error deleting product", error: err2 });

      // 🧹 Delete image file if exists
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr)
            console.warn("⚠️ Failed to delete image file:", unlinkErr.message);
        });
      }

      res.json({ message: "🗑️ Product deleted successfully" });
    });
  });
};
