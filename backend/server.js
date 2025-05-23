const express = require("express");
const connectdb = require("./config/db");
const authRoutes = require("./routes/auth"); // assuming you're using auth.js

const server = express();
const PORT = 8000;

server.use(express.json());
require("dotenv").config();


// Connect MongoDB
connectdb();

// Use auth routes
server.use("/api/auth", authRoutes);

// Default route
server.get("/", (req, res) => {
  res.send("This is my home page");
});

// Start server
server.listen(PORT, () => {
  console.log(`Your server is running at http://localhost:${PORT}`);
});
