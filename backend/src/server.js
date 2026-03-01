require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");
const authRoutes = require("./authRoutes");
const moviesRoutes = require("./moviesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Updated CORS to allow both your local dev and your Vercel frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://netflix-ddon.vercel.app" // Your live frontend URL
    ],
    credentials: true
  })
);

app.use(express.json());

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend is running!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);

// Database initialization
(async () => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");
    }

    if (!process.env.MYSQL_URL) {
      console.error("MYSQL_URL is missing");
    }

    await initDb();
    
    // Only call app.listen if NOT running on Vercel
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("Startup failure:", error.message);
  }
})();

// CRITICAL: Export the app for Vercel
module.exports = app;