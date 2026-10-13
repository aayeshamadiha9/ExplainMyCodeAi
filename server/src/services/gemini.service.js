/**
 * Gemini AI Service for Explain My Code AI
 * Supports official Google GenAI SDKs with structured JSON output, retry logic, sanitization, and fallback.
 */

const { geminiApiKey, geminiModel, mockGemini, isTest } = require("../config/env");
const { buildSystemPrompt, buildUserPrompt } = require("./prompt.service");

let googleGenAIClient = null;
let legacyGenerativeAI = null;

// Initialize clients safely
try {
  const { GoogleGenAI } = require("@google/genai");
  if (geminiApiKey) {
    googleGenAIClient = new GoogleGenAI({ apiKey: geminiApiKey });
  }
} catch (err) {
  // @google/genai not available or failed to load
}

try {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  if (geminiApiKey) {
    legacyGenerativeAI = new GoogleGenerativeAI(geminiApiKey);
  }
} catch (err) {
  // @google/generative-ai not available
}

/**
 * Sanitizes and normalizes the parsed explanation JSON according to project requirements.
 * @param {Object} raw
 * @param {string} requestedMode
 * @param {string} defaultLang
 * @returns {Object}
 */
function sanitizeExplanation(raw, requestedMode, defaultLang) {
  const mode = raw.mode || requestedMode;
  const language = raw.language || (defaultLang !== "auto" ? defaultLang : "Unknown");
  const exp = raw.explanation || {};

  const overview = typeof exp.overview === "string" && exp.overview.trim().length > 0
    ? exp.overview.trim()
    : "This code implements the logic presented in the snippet.";

  const stepByStep = Array.isArray(exp.stepByStep)
    ? exp.stepByStep.map((s, index) => ({
        lines: s.lines ? String(s.lines).trim() : `${index + 1}`,
        explanation: s.explanation ? String(s.explanation).trim() : "Executes this segment of the code.",
      }))
    : [];

  const keyConcepts = Array.isArray(exp.keyConcepts)
    ? exp.keyConcepts.map((k) => ({
        name: k.name ? String(k.name).trim() : "Core Programming Concept",
        description: k.description ? String(k.description).trim() : "Relevant programmatic construct.",
      }))
    : [];

  let complexity = null;
  if (exp.complexity && typeof exp.complexity === "object") {
    complexity = {
      time: exp.complexity.time ? String(exp.complexity.time).trim() : "O(n)",
      space: exp.complexity.space ? String(exp.complexity.space).trim() : "O(1)",
      notes: exp.complexity.notes ? String(exp.complexity.notes).trim() : "Standard evaluation.",
    };
  } else if (mode === "advanced" || mode === "interview") {
    // Required for advanced and interview modes
    complexity = {
      time: "O(n)",
      space: "O(1)",
      notes: "Estimated asymptotic complexity for this code.",
    };
  }

  const potentialIssues = Array.isArray(exp.potentialIssues)
    ? exp.potentialIssues.map((issue) => String(issue).trim()).filter(Boolean)
    : [];

  const improvements = Array.isArray(exp.improvements)
    ? exp.improvements.map((imp) => String(imp).trim()).filter(Boolean)
    : [];

  let interviewQuestions = [];
  if (mode === "interview" && Array.isArray(exp.interviewQuestions)) {
    interviewQuestions = exp.interviewQuestions.map((q) => ({
      question: q.question ? String(q.question).trim() : "How would you optimize this solution for large inputs?",
      answer: q.answer ? String(q.answer).trim() : "Consider streaming, memoization, or balanced data structures.",
    }));
  }

  return {
    language,
    mode,
    explanation: {
      overview,
      stepByStep,
      keyConcepts,
      ...(complexity ? { complexity } : {}),
      potentialIssues,
      improvements,
      interviewQuestions,
    },
  };
}

/**
 * Generates mock response for offline testing or unit tests
 */
function getMockExplanation(code, language, mode) {
  const detectedLang = language === "auto" ? "JavaScript" : language;
  return {
    language: detectedLang,
    mode,
    explanation: {
      overview: `This ${detectedLang} code executes a structured routine with clear flow control and modular data management.`,
      stepByStep: [
        { lines: "1-4", explanation: "Initializes parameters and establishes boundary safeguards." },
        { lines: "5-10", explanation: "Processes data through iteration and evaluates conditional expressions." },
        { lines: "11-14", explanation: "Returns the computed state or yields transformed output." },
      ],
      keyConcepts: [
        { name: "Flow Control", description: "Sequencing execution using conditional logic and iteration." },
        { name: "Modular Scoping", description: "Maintaining encapsulated state within the function boundary." },
      ],
      complexity: mode !== "beginner" ? {
        time: "O(n)",
        space: "O(1)",
        notes: "Iterates linearly through the problem space with constant auxiliary memory.",
      } : null,
      potentialIssues: [
        "Ensure edge cases like null, undefined, or empty collections are guarded.",
      ],
      improvements: [
        "Consider extracting reusable sub-routines and applying immutable patterns.",
      ],
      interviewQuestions: mode === "interview" ? [
        {
          question: "How would you scale this implementation if the input size exceeded available memory?",
          answer: "Process input in streaming chunks or use external memory algorithms with disk-backed buffers.",
        },
        {
          question: "What are the primary concurrency concerns if called across multiple worker threads?",
          answer: "Ensure shared states are guarded via locks or use purely functional, immutable transformations.",
        },
        {
          question: "Can this time complexity be further reduced to logarithmic or constant time?",
          answer: "If the input is sorted or indexed with a hash map, lookups and searches can achieve O(1) or O(log n).",
        },
      ] : [],
    },
    meta: {
      model: "gemini-2.5-flash-mock",
      latencyMs: 120,
    },
  };
}

/**
 * Extracts and cleans JSON string from AI response
 */
function parseJsonSafe(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response text from AI model");
  }
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  }
  return JSON.parse(cleaned);
}

/**
 * Calls Gemini API to generate explanation
 * @param {Object} params
 * @param {string} params.code
 * @param {string} params.language
 * @param {string} params.mode
 * @returns {Promise<Object>}
 */
async function generateExplanation({ code, language, mode }) {
  const startTime = Date.now();

  // If mock mode is explicitly active or in test without an API key
  if (mockGemini || (isTest && (!geminiApiKey || geminiApiKey === "your_key_here"))) {
    return getMockExplanation(code, language, mode);
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt({ code, language, mode });

  let rawJson = null;
  let attempt = 0;
  let lastError = null;

  while (attempt < 2 && !rawJson) {
    attempt++;
    try {
      let responseText = null;

      // 1. Try @google/genai unified client
      if (googleGenAIClient) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Gemini API request timed out after 30s")), 30000)
          );

          const generatePromise = googleGenAIClient.models.generateContent({
            model: geminiModel,
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.3,
              responseMimeType: "application/json",
            },
          });

          const result = await Promise.race([generatePromise, timeoutPromise]);
          responseText = result.text || (result.candidates && result.candidates[0]?.content?.parts[0]?.text);
        } catch (genAiErr) {
          // Fall back to @google/generative-ai if @google/genai fails
          if (!legacyGenerativeAI) throw genAiErr;
        }
      }

      // 2. Fall back to @google/generative-ai SDK if responseText is not yet obtained
      if (!responseText && legacyGenerativeAI) {
        const model = legacyGenerativeAI.getGenerativeModel({
          model: geminiModel,
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
          systemInstruction: systemPrompt,
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Gemini API request timed out after 30s")), 30000)
        );

        const generatePromise = model.generateContent(userPrompt);
        const result = await Promise.race([generatePromise, timeoutPromise]);
        responseText = result.response.text();
      }

      if (!responseText) {
        throw new Error("No response content received from Gemini API");
      }

      rawJson = parseJsonSafe(responseText);
    } catch (err) {
      lastError = err;
      if (attempt >= 2) break;
      // Brief backoff before retry
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  if (!rawJson) {
    const error = new Error(`Failed to generate explanation from Gemini API: ${lastError?.message || "Unknown error"}`);
    error.status = 502;
    error.code = "GEMINI_ERROR";
    throw error;
  }

  const sanitized = sanitizeExplanation(rawJson, mode, language);
  const latencyMs = Date.now() - startTime;

  return {
    ...sanitized,
    meta: {
      model: geminiModel,
      latencyMs,
    },
  };
}

module.exports = {
  generateExplanation,
  sanitizeExplanation,
  getMockExplanation,
  parseJsonSafe,
};
