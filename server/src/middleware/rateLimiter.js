const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for /api/explain
 * 20 requests per 15 minutes per IP
 */
const explainRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  standardHeaders: true, // Return standard RateLimit headers
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many explanation requests from this IP. Please wait 15 minutes before trying again.",
      },
    });
  },
  skip: (req) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === "test";
  },
});

module.exports = {
  explainRateLimiter,
};
