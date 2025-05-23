// backend/routes/auth.js

const express = require("express");
const router = express.Router();

const { registeruser, loginUser } = require("../controllers/authController");

router.post("/register", registeruser); // ✅ Must be a function
router.post("/login", loginUser);       // ✅ Must be a function

module.exports = router;
