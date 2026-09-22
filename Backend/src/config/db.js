const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database");
    connection.release();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

module.exports = pool;
module.exports.testConnection = testConnection;
