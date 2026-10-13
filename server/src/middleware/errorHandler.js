/**
 * Central error handling middleware.
 * Ensures no stack traces or sensitive credentials leak in responses.
 */

function errorHandler(err, req, res, next) {
  // Sanitize any potential API keys from error message before logging
  const safeMessage = (err.message || "").replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED_API_KEY]");

  // Structured console logging without leaking secrets
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    status: err.status || 500,
    code: err.code || "INTERNAL_SERVER_ERROR",
    error: safeMessage,
  }));

  // Handle payload too large from express.json()
  if (err.type === "entity.too.large" || err.status === 413) {
    return res.status(413).json({
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: "Request payload exceeds 100kb limit.",
      },
    });
  }

  // Handle syntax error in JSON body parser
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Malformed JSON payload.",
      },
    });
  }

  // Specific status codes
  const status = err.status || (err.code === "GEMINI_ERROR" || err.code === "GEMINI_FAILURE" ? 502 : 500);
  const code =
    status === 502
      ? "GEMINI_FAILURE"
      : err.code || "INTERNAL_SERVER_ERROR";
  const message =
    status >= 500 && status !== 502
      ? "An unexpected internal server error occurred. Please try again later."
      : safeMessage || "An error occurred while processing your request.";

  return res.status(status).json({
    error: {
      code,
      message,
    },
  });
}

/**
 * 404 Route Not Found handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist.`,
    },
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
