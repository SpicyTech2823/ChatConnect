const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();
// Function to generate JWT token 
function generateToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
}
// Registration endpoint
router.post("/register", async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";
    const phone =
      typeof req.body.phone === "string" && req.body.phone.trim()
        ? req.body.phone.trim()
        : null;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: "Enter a valid email address" });
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });

    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length)
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, phone, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword],
    );
    const user = { id: result.insertId, username: name, email, phone };
    return res
      .status(201)
      .json({
        message: "Registered successfully",
        token: generateToken(user),
        user,
      });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    const [rows] = await pool.execute(
      "SELECT id, username, email, phone, password_hash FROM users WHERE email = ?",
      [email],
    );
    if (
      !rows.length ||
      !(await bcrypt.compare(password, rows[0].password_hash))
    ) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = {
      id: rows[0].id,
      username: rows[0].username,
      email: rows[0].email,
      phone: rows[0].phone,
    };
    return res.json({
      message: "Logged in successfully",
      token: generateToken(user),
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, username, email, phone, created_at FROM users WHERE id = ?",
      [req.user.id],
    );
    if (!rows.length)
      return res.status(404).json({ message: "User not found" });
    return res.json({ user: rows[0] });
  } catch (error) {
    console.error("User lookup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
