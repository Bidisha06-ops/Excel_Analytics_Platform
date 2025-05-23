const jwt = require("jsonwebtoken");
const usermodel = require("../models/user");

// Middleware to verify JWT token and attach user to request
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID (without password)
      req.user = await usermodel.findById(decoded.id).select("-password");

      next(); // Proceed to the next middleware or route
    } catch (error) {
      console.error("JWT verification failed:", error.message);
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, token missing" });
  }
};

// Middleware to restrict access to admin users only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Admin is verified
  } else {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
};

module.exports = { protect, adminOnly };
