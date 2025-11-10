import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// 🧠 Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "all_in_one",
});

// 🧩 Test connection
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully!");
  }
});

// ✅ Export default (important for ESM import)
export default db;
