import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

// 🧠 Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🧩 Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if admin already exists
    const [existingAdmins] = await db
      .promise()
      .query("SELECT * FROM admins WHERE email = ?", [email]);

    if (existingAdmins.length > 0) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    // Hash password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert admin into DB
    await db
      .promise()
      .query("INSERT INTO admins (name, email, password) VALUES (?, ?, ?)", [
        name,
        email,
        hashedPassword,
      ]);

    console.log(`✅ New admin registered: ${email}`);
    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// 🔐 Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🧩 Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find admin by email
    const [admins] = await db
      .promise()
      .query("SELECT * FROM admins WHERE email = ?", [email]);

    if (admins.length === 0) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const admin = admins[0];

    // Compare hashed passwords
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "2h" }
    );

    console.log(`🔐 Admin logged in: ${email}`);

    // Send token + admin details
    res.status(200).json({
      message: "Login successful.",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
