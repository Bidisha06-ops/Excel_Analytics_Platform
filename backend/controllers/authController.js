const usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateTokens");


const registeruser = async (req, res) => {
  try {
    //  It will Destructure request body
    const { username, email, password, role } = req.body;

    // 2. It is the Validate fields
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Here the Validate role explicitly
    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    // Here the Check for duplicate email
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // we can Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // to create the user object
    const newUser = new usermodel({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // it is for store in DB
    const user = await newUser.save();

    // to generate JWT token
    const token = generateToken(user);

    // it respond with success
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    // to handle the error
    console.error("Register error:", error.message);
    return res.status(500).json({ success: false, message: "Server error during registration" });
  }
};




const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔒 Block check
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact admin.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || "user",
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = { registeruser, loginUser };
