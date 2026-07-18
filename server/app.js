require("dotenv").config();
const express = require("express");
const cors = require("cors");
const tripRoutes = require("./routes/trip");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the configured client origin(s). Falls back to allowing all origins
// in development if CLIENT_ORIGIN is not set.
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : "*";

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "wandering-souls-server" });
});

app.use("/", tripRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "NOT_FOUND", message: "Route not found." });
});

// Global error handler (catches anything unexpected/unhandled)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "SERVER_ERROR",
    message: "An unexpected server error occurred.",
  });
});

app.listen(PORT, () => {
  console.log(`Wandering Souls server running on port ${PORT}`);
});

module.exports = app;
