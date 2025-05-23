const express = require("express");
const router = express.Router(); // ✅ Define router

const { protect, adminOnly } = require("../middleware/auth");

// ✅ Protected route (any logged-in user)
router.get("/profile", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ✅ Admin-only route
router.get("/admin/dashboard", protect, adminOnly, (req, res) => {
  res.json({ success: true, message: "Welcome Admin!" });
});

module.exports = router;
