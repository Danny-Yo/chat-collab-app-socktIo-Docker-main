const jwt = require("jsonwebtoken");
const User = require("../models/users");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token using the correct secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded token's id
    req.user = await User.findById(decoded.id).select("-password"); // avoid returning password
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    // console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// authMiddleware.js
const allowedIPs = new Set(); // store IPs of logged-in users temporarily

function requireLogin(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress;

  if (allowedIPs.has(clientIP)) {
    next();
  } else {
    return res.status(401).json({ error: "Login required" });
  }
}

// Call this after successful login
function registerIP(req) {
  const clientIP = req.ip || req.connection.remoteAddress;
  allowedIPs.add(clientIP);
}

module.exports = { requireLogin, registerIP };


module.exports = { auth };
