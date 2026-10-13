const { z } = require("zod");
const { supportedLanguages, supportedModes, maxCodeLength } = require("../config/env");

// Create case-insensitive matching helpers
const validLanguageValues = ["auto", ...supportedLanguages];

const explainSchema = z.object({
  code: z
    .string({
      required_error: "Source code is required.",
      invalid_type_error: "Source code must be a string.",
    })
    .transform((val) => val.trim()),
  language: z
    .string()
    .optional()
    .default("auto")
    .transform((val) => (val ? val.trim() : "auto")),
  mode: z
    .string()
    .optional()
    .default("beginner")
    .transform((val) => (val ? val.trim().toLowerCase() : "beginner")),
});

/**
 * Middleware to validate /api/explain request body
 */
function validateExplainRequest(req, res, next) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid JSON body provided.",
      },
    });
  }

  const result = explainSchema.safeParse(req.body);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: firstIssue ? firstIssue.message : "Validation failed.",
      },
    });
  }

  const { code, language, mode } = result.data;

  // Validate code length (1 to MAX_CODE_LENGTH)
  if (!code || code.length === 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Code snippet cannot be empty or solely whitespace.",
      },
    });
  }

  if (code.length > maxCodeLength) {
    return res.status(413).json({
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: `Code snippet exceeds the maximum allowed length of ${maxCodeLength} characters (received ${code.length}).`,
      },
    });
  }

  // Validate language
  const isLangSupported = validLanguageValues.some(
    (l) => l.toLowerCase() === language.toLowerCase()
  );
  if (!isLangSupported) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: `Language '${language}' is not supported. Supported languages: ${validLanguageValues.join(", ")}`,
      },
    });
  }

  // Find canonical casing of language
  const canonicalLang =
    language.toLowerCase() === "auto"
      ? "auto"
      : supportedLanguages.find((l) => l.toLowerCase() === language.toLowerCase()) || language;

  // Validate mode
  if (!supportedModes.includes(mode)) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: `Mode '${mode}' is invalid. Supported modes: ${supportedModes.join(", ")}`,
      },
    });
  }

  // Attach sanitized data to request
  req.validatedBody = {
    code,
    language: canonicalLang,
    mode,
  };

  next();
}

module.exports = {
  validateExplainRequest,
};
