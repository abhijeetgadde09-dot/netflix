require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");
const authRoutes = require("./authRoutes");
const moviesRoutes = require("./moviesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);

(async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in backend/.env");
    }

    if (!process.env.MYSQL_URL) {
      throw new Error("MYSQL_URL is missing in backend/.env");
    }

    if (!process.env.OMDB_API_KEY) {
      throw new Error("OMDB_API_KEY is missing in backend/.env");
    }

    await initDb();
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup failure:", error.message);
    process.exit(1);
  }
})();
