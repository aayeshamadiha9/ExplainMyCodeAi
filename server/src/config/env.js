const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const NODE_ENV = process.env.NODE_ENV || "development";
const isTest = NODE_ENV === "test";
const mockGemini = process.env.MOCK_GEMINI === "true";
const geminiApiKey = process.env.GEMINI_API_KEY;

// Fail-fast validation for GEMINI_API_KEY
if (!isTest && !mockGemini && (!geminiApiKey || geminiApiKey.trim() === "" || geminiApiKey === "your_key_here")) {
  console.error("=".repeat(70));
  console.error("FATAL ERROR: Missing or placeholder GEMINI_API_KEY!");
  console.error("Please add your Google Gemini API key to server/.env:");
  console.error("  GEMINI_API_KEY=AIzaSy...");
  console.error("Get a free key at https://aistudio.google.com/");
  console.error("Alternatively, set MOCK_GEMINI=true in server/.env for offline testing.");
  console.error("=".repeat(70));
  process.exit(1);
}

const SUPPORTED_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Kotlin",
  "Swift",
  "SQL",
  "HTML/CSS",
  "Bash",
];

const SUPPORTED_MODES = ["beginner", "intermediate", "advanced", "interview"];

module.exports = {
  port: parseInt(process.env.PORT || "5000", 10),
  geminiApiKey: geminiApiKey || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  maxCodeLength: parseInt(process.env.MAX_CODE_LENGTH || "8000", 10),
  nodeEnv: NODE_ENV,
  isTest,
  mockGemini,
  supportedLanguages: SUPPORTED_LANGUAGES,
  supportedModes: SUPPORTED_MODES,
};
