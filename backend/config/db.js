// import mysql from "mysql2";
// import dotenv from "dotenv";

// dotenv.config();

// // 🧠 Create MySQL connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "",
//   database: process.env.DB_NAME || "all_in_one",
// });

// // 🧩 Test connection
// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err.message);
//   } else {
//     console.log("✅ MySQL Connected Successfully!");
//   }
// });

// // ✅ Export default (important for ESM import)
// export default db;


// 📦 Import dependencies
// import mysql from "mysql2";
// import dotenv from "dotenv";

// // 🧩 Load environment variables
// dotenv.config();

// // 🧠 Create MySQL connection with fallback values
// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "",
//   database: process.env.DB_NAME || "all_in_one",
//   port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
//   connectTimeout: 10000, // ⏱️ optional timeout (10s)
//   multipleStatements: false, // 🔒 safer queries
// });

// // 🧩 Try connecting to the database
// db.connect((err) => {
//   if (err) {
//     console.error("❌ MySQL connection failed!");
//     console.error("📛 Error details:", err.message);

//     // Helpful info for debugging
//     console.log("🔍 DB_HOST:", process.env.DB_HOST);
//     console.log("🔍 DB_USER:", process.env.DB_USER);
//     console.log("🔍 DB_NAME:", process.env.DB_NAME);
//   } else {
//     console.log("✅ MySQL Connected Successfully!");
//     console.log(`🌐 Host: ${process.env.DB_HOST}`);
//     console.log(`📁 Database: ${process.env.DB_NAME}`);
//   }
// });

// // ✅ Export connection (for use in routes/controllers)
// export default db;


// 📁 config/db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

// ✅ PostgreSQL Pool Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Test connection
try {
  const client = await pool.connect();
  console.log("✅ Connected to Neon PostgreSQL Database!");
  client.release();
} catch (err) {
  console.error("❌ Database connection error:", err.message);
}

export default pool;
