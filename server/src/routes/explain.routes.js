const express = require("express");
const { getMeta, explainCode } = require("../controllers/explain.controller");
const { validateExplainRequest } = require("../middleware/validate");
const { explainRateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

/**
 * GET /api/meta
 * Returns supported languages and modes
 */
router.get("/meta", getMeta);

/**
 * POST /api/explain
 * Analyzes and explains source code
 */
router.post("/explain", explainRateLimiter, validateExplainRequest, explainCode);

module.exports = router;
