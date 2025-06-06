const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Route files
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/upload");
const recordRoutes = require("./routes/record");
const activityRoutes = require("./routes/activity");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json()); // For parsing application/json

// Static file serving (for profile images or uploads if needed)
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", authRoutes);          // Auth: login/register
app.use("/api/user", userRoutes);          // User profile management
app.use("/api/upload", uploadRoutes);      // Excel file uploads
app.use("/api/records", recordRoutes);     // Get uploaded files
app.use("/api/activity", activityRoutes);  // Activity log routes

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Excel Analytics Platform API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
