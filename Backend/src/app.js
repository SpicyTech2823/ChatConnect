const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "ChatConnect API is running" });
});
module.exports = app;
