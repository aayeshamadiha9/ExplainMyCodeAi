import axios from "axios";

// Default to empty string so it leverages Vite proxy in dev, or custom VITE_API_URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45000, // 45 seconds timeout for LLM generation
});

/**
 * Fetch server health status
 */
export async function getHealthStatus() {
  try {
    const response = await apiClient.get("/api/health");
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

/**
 * Fetch supported languages and modes
 */
export async function getMeta() {
  try {
    const response = await apiClient.get("/api/meta");
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

/**
 * Request an AI explanation for code snippet
 * @param {Object} params
 * @param {string} params.code
 * @param {string} params.language
 * @param {string} params.mode
 */
export async function explainCode({ code, language, mode }) {
  try {
    const response = await apiClient.post("/api/explain", {
      code,
      language,
      mode,
    });
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

/**
 * Normalizes error responses into a clean UI-friendly object
 */
function normalizeApiError(error) {
  if (error.response && error.response.data && error.response.data.error) {
    const { code, message } = error.response.data.error;
    return {
      code: code || "API_ERROR",
      message: message || "An error occurred with the AI service.",
      status: error.response.status,
    };
  }

  if (error.code === "ECONNABORTED") {
    return {
      code: "TIMEOUT",
      message: "The request timed out. AI model generation took longer than expected. Please try again.",
      status: 408,
    };
  }

  if (error.request && !error.response) {
    return {
      code: "NETWORK_ERROR",
      message: "Cannot connect to server. Ensure the backend is running at http://localhost:5000.",
      status: 0,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: error.message || "An unexpected error occurred.",
    status: 500,
  };
}

export default apiClient;
