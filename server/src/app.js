const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { clientOrigin, isTest } = require("./config/env");
const healthRoutes = require("./routes/health.routes");
const explainRoutes = require("./routes/explain.routes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  clientOrigin,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: origin not permitted"), false);
    },
    credentials: true,
  })
);

// JSON body parser with strict 100kb payload limit
app.use(express.json({ limit: "100kb" }));

// Request logging (skip during automated tests)
if (!isTest) {
  app.use(morgan("dev"));
}

// API Routes
app.use("/api", healthRoutes);
app.use("/api", explainRoutes);

// 404 & Central Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
