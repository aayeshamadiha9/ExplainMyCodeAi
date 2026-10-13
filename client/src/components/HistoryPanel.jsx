import React from "react";
import { History, Trash2, X, Code2, ArrowRight } from "lucide-react";

export default function HistoryPanel({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
}) {
  if (!isOpen) return null;

  const formatDate = (isoStr) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        " · " +
        date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <div
      className="history-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Explanation History"
      id="history-drawer-overlay"
    >
      <div
        className="history-drawer"
        onClick={(e) => e.stopPropagation()}
        id="history-drawer-panel"
      >
        <div className="history-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <History size={18} color="#818cf8" />
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700" }}>Recent Explanations</h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {history.length > 0 && (
              <button
                className="btn-icon"
                onClick={onClear}
                title="Clear all saved history"
                aria-label="Clear history"
                id="btn-clear-history"
                style={{ color: "#ef4444" }}
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              className="btn-icon"
              onClick={onClose}
              title="Close history panel"
              aria-label="Close"
              id="btn-close-history"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="history-empty">
              <Code2 size={32} style={{ opacity: 0.3, marginBottom: "0.75rem" }} />
              <p>No explanations saved yet.</p>
              <p style={{ fontSize: "0.78rem", marginTop: "0.25rem" }}>
                Explanations you generate will automatically be cached here for quick reference.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="history-card"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                role="button"
                tabIndex={0}
              >
                <div className="history-card-top">
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    <span className="meta-badge meta-badge-lang" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>
                      {item.language}
                    </span>
                    <span
                      className={`meta-badge mode-${item.mode}`}
                      style={{ fontSize: "0.7rem", padding: "1px 6px" }}
                    >
                      {item.mode}
                    </span>
                  </div>
                  <span className="history-time">{formatDate(item.timestamp)}</span>
                </div>

                <pre className="history-code-preview">{item.codeSnippet}</pre>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    fontSize: "0.75rem",
                    color: "var(--text-accent)",
                    gap: "3px",
                  }}
                >
                  <span>Restore</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
