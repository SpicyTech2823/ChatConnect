const jwt = require("jsonwebtoken");
// Middleware to authenticate requests using JWT
module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ message: "No token, access denied" });
  if (!authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Invalid authorization header" });
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
