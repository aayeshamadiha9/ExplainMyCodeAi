import React from "react";
import { AlertTriangle, RefreshCw, X, ShieldAlert, Clock, ServerOff } from "lucide-react";

export default function ErrorBanner({ error, onRetry, onDismiss }) {
  if (!error) return null;

  const isRateLimit = error.code === "RATE_LIMIT_EXCEEDED" || error.status === 429;
  const isNetwork = error.code === "NETWORK_ERROR" || error.status === 0;
  const isGeminiError = error.code === "GEMINI_FAILURE" || error.status === 502;
  const isValidation = error.code === "VALIDATION_ERROR" || error.status === 400;

  const getErrorIcon = () => {
    if (isRateLimit) return <Clock size={20} color="#f59e0b" />;
    if (isNetwork) return <ServerOff size={20} color="#ef4444" />;
    if (isGeminiError) return <ShieldAlert size={20} color="#ef4444" />;
    return <AlertTriangle size={20} color="#ef4444" />;
  };

  const getErrorTitle = () => {
    if (isRateLimit) return "Rate Limit Reached";
    if (isNetwork) return "Server Connection Error";
    if (isGeminiError) return "AI Service Unavailable";
    if (isValidation) return "Input Validation Error";
    return "Explanation Request Failed";
  };

  return (
    <div className="error-banner" role="alert" id="explanation-error-banner">
      <div style={{ flexShrink: 0, marginTop: "2px" }}>{getErrorIcon()}</div>

      <div style={{ flex: 1 }}>
        <h4 className="error-title">{getErrorTitle()}</h4>
        <p className="error-message">{error.message || "An unexpected error occurred."}</p>

        {isGeminiError && (
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.35rem" }}>
            Make sure a valid <code>GEMINI_API_KEY</code> is configured in <code>server/.env</code>.
          </p>
        )}

        {onRetry && (
          <button
            className="error-retry-btn"
            onClick={onRetry}
            id="btn-retry-explanation"
          >
            <RefreshCw size={13} />
            <span>Try Again</span>
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "4px",
          }}
          title="Dismiss notification"
          aria-label="Dismiss error"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
