const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../models/user");
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/uploadImage");

// GET /api/user/profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("username email role createdAt profileImage");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/user/profile/username - Update Username
router.put("/profile/username", protect, async (req, res) => {
  const { username } = req.body;
  try {
    if (!username) return res.status(400).json({ success: false, message: "Username is required" });

    req.user.username = username;
    await req.user.save();
    res.json({ success: true, message: "Username updated", user: req.user });
  } catch (error) {
    console.error("Username update error:", error);
    res.status(500).json({ success: false, message: "Failed to update username" });
  }
});


// PUT /api/user/profile/image - Upload/Change Profile Image
router.put("/profile/image", protect, upload.single("profileImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    req.user.profileImage = `/uploads/profileImages/${req.file.filename}`;
    await req.user.save();

    res.json({ success: true, message: "Profile image updated", imagePath: req.user.profileImage });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ success: false, message: "Failed to upload profile image" });
  }
});

// Admin-only route (example)
router.get("/admin/dashboard", protect, adminOnly, (req, res) => {
  res.json({ success: true, message: "Welcome Admin!" });
});

module.exports = router;
