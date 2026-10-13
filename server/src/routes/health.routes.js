const express = require("express");

const router = express.Router();

/**
 * GET /api/health
 * Returns { "status": "ok", "uptime": <seconds> }
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
  });
});

module.exports = router;
