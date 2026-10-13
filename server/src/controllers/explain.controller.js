const { supportedLanguages, supportedModes } = require("../config/env");
const geminiService = require("../services/gemini.service");

/**
 * Controller for GET /api/meta
 */
function getMeta(req, res) {
  res.json({
    languages: supportedLanguages,
    modes: supportedModes,
  });
}

/**
 * Controller for POST /api/explain
 */
async function explainCode(req, res, next) {
  try {
    const { code, language, mode } = req.validatedBody;
    const result = await geminiService.generateExplanation({ code, language, mode });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMeta,
  explainCode,
};
