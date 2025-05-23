// backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

dotenv.config();              // Load environment variables

const app = express();        // Initialize express app
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());      // JSON body parser

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);   // Authentication routes

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Excel Analytics Platform API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
