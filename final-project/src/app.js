// src/app.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bookingsRouter from "./routes/bookings.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middleware ---
app.use(express.json()); // Parse application/json

// Enable CORS for frontend requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// --- API routes ---
app.use("/api/bookings", bookingsRouter);

// --- API 404 (unknown API routes) ---
app.use("/api", (req, res) => {
  return res.status(404).json({
    ok: false,
    error: "Not found",
    path: req.originalUrl,
  });
});

// --- Central error handler ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (res.headersSent) return next(err);

  return res.status(500).json({
    ok: false,
    error: "Internal server error",
  });
});

export default app;
