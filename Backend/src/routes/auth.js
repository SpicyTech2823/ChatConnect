const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All are required" });
    if (password.length > 6)
      return res.status(400).json({ message: "Password must be 6 characters" });
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already register" });
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?) ",
      [name, email, hashed],
    );
    // generate user token
    const user = { id: result.insertId, name, email };
    const token = generateToken(user);

    res.status(201).json({ message: "Registered successfully", token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All are required" });
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = generateToken(user);
    res.json({
      message: "Logged in successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});
// PROTECTED
router.get('/me', auth, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  res.json(rows[0]);
});

module.exports = router;
