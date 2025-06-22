const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  console.log("🔥 Incoming token:", token);
  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Token decoded:", decoded);
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;
