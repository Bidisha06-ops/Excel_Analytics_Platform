const express = require("express");
const mongoose = require("mongoose");        // <-- add this line
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


// Storage stats endpoint
app.get("/api/storage", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) { // 1 means connected
      return res.status(500).json({ error: "MongoDB not connected yet" });
    
    }
    
    const db = mongoose.connection.db;
   

    if (!db) {
      return res.status(500).json({ error: "Database object not available" });
    }

    const stats = await db.stats();

    const totalQuota = 512 * 1024 * 1024; // 512MB quota (adjust if needed)

    res.json({
      storageSize: stats.storageSize,
      dataSize: stats.dataSize,
      totalQuota,
      collections: stats.collections,
      objects: stats.objects,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
    });
  } catch (error) {
    console.error("Error fetching db stats:", error);
    res.status(500).json({ error: "Failed to fetch storage stats" });
  }
});


// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Excel Analytics Platform API" });
});

// Connect to DB and then start server
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");  // <-- add this line
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });


const aiSuggestionRoutes = require('./routes/aiRoutes');
app.use('/api/ai/', aiSuggestionRoutes);

const recentChartsRoutes = require('./routes/recentCharts');
app.use('/api/recentCharts', recentChartsRoutes);


const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
