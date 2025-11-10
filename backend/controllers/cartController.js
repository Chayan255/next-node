import db from "../config/db.js";

// ➕ Add or update cart item
export const addOrUpdateCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const checkQuery = "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
  db.query(checkQuery, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });

    if (result.length > 0) {
      // Update existing quantity
      const updateQuery =
        "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
      db.query(updateQuery, [quantity, user_id, product_id], (err2) => {
        if (err2)
          return res.status(500).json({ message: "Failed to update cart" });
        return res.json({ message: "Quantity updated successfully" });
      });
    } else {
      // Insert new cart item
      const insertQuery =
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
      db.query(insertQuery, [user_id, product_id, quantity], (err3) => {
        if (err3)
          return res.status(500).json({ message: "Failed to add item" });
        return res.json({ message: "Item added to cart successfully" });
      });
    }
  });
};

// 🧺 Get user cart
export const getCart = (req, res) => {
  const { user_id } = req.params;
  const query = `
    SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(query, [user_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    res.json(result);
  });
};

// ❌ Remove item from cart
export const removeFromCart = (req, res) => {
  const { user_id, product_id } = req.params;
  const query = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
  db.query(query, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item removed successfully" });
  });
};
