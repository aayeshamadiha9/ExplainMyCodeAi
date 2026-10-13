import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LanguageSelect from "../components/LanguageSelect";
import ModeSelector from "../components/ModeSelector";
import CodeEditor from "../components/CodeEditor";
import ExplanationView from "../components/ExplanationView";
import Loader from "../components/Loader";
import ErrorBanner from "../components/ErrorBanner";
import HistoryPanel from "../components/HistoryPanel";
import { useExplain } from "../hooks/useExplain";
import { CODE_EXAMPLES } from "../data/examples";
import { getHealthStatus } from "../services/api";
import { Bot, Sparkles, BookOpen, History, Server, Activity } from "lucide-react";

const VALID_MODES = ["beginner", "intermediate", "advanced", "interview"];

export default function Explainer({ theme }) {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode");

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("auto");
  const [mode, setMode] = useState(
    initialMode && VALID_MODES.includes(initialMode.toLowerCase())
      ? initialMode.toLowerCase()
      : "beginner"
  );
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [serverOnline, setServerOnline] = useState(null);

  const {
    loading,
    error,
    explanation,
    history,
    requestExplanation,
    retryLastRequest,
    clearExplanation,
    clearHistory,
    restoreFromHistory,
    setError,
  } = useExplain();

  // Set page title
  useEffect(() => {
    document.title = "Explain Code | Explain My Code AI";
  }, []);

  // Sync mode if query parameter changes in URL
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode && VALID_MODES.includes(urlMode.toLowerCase())) {
      setMode(urlMode.toLowerCase());
    }
  }, [searchParams]);

  // Check backend server health
  useEffect(() => {
    let isMounted = true;
    async function checkServer() {
      try {
        const health = await getHealthStatus();
        if (isMounted && health && health.status === "ok") {
          setServerOnline(true);
        }
      } catch (err) {
        if (isMounted) setServerOnline(false);
      }
    }

    checkServer();
    const interval = setInterval(checkServer, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Submit explanation request
  const handleSubmit = () => {
    requestExplanation({ code, language, mode });
  };

  // Clear code and active output
  const handleClear = () => {
    setCode("");
    clearExplanation();
  };

  // Cycle through code examples
  const handleLoadExample = () => {
    const example = CODE_EXAMPLES[exampleIndex % CODE_EXAMPLES.length];
    setCode(example.code);
    setLanguage(example.language);
    setMode(example.mode);
    setExampleIndex((prev) => prev + 1);
  };

  // Restore previous item from history
  const handleSelectHistoryItem = (item) => {
    if (item.fullCode) {
      setCode(item.fullCode);
    }
    if (item.language) {
      setLanguage(item.language);
    }
    if (item.mode) {
      setMode(item.mode);
    }
    restoreFromHistory(item);
  };

  return (
    <div className="explainer-page">
      <main className="main-content">
        {/* Workspace Toolbar: Status, History & Direct Navigation */}
        <div className="workspace-toolbar">
          <div className="toolbar-left">
            <h2 className="toolbar-title">AI Code Explainer Studio</h2>
            <p className="toolbar-subtitle">
              Paste or type code below to generate structured insights
            </p>
          </div>

          <div className="toolbar-right">
            {/* Live API Status Pill */}
            <div
              className="status-pill"
              style={{
                backgroundColor:
                  serverOnline === true
                    ? "rgba(16, 185, 129, 0.12)"
                    : serverOnline === false
                    ? "rgba(239, 68, 68, 0.12)"
                    : "rgba(245, 158, 11, 0.12)",
                borderColor:
                  serverOnline === true
                    ? "rgba(16, 185, 129, 0.3)"
                    : serverOnline === false
                    ? "rgba(239, 68, 68, 0.3)"
                    : "rgba(245, 158, 11, 0.3)",
                color:
                  serverOnline === true
                    ? "#10b981"
                    : serverOnline === false
                    ? "#ef4444"
                    : "#f59e0b",
              }}
              title={
                serverOnline === true
                  ? "Backend connected and healthy"
                  : serverOnline === false
                  ? "Backend offline. Check if port 5000 is running."
                  : "Checking backend status..."
              }
            >
              <span
                className="status-dot"
                style={{
                  backgroundColor:
                    serverOnline === true
                      ? "#10b981"
                      : serverOnline === false
                      ? "#ef4444"
                      : "#f59e0b",
                  boxShadow:
                    serverOnline === true
                      ? "0 0 8px #10b981"
                      : serverOnline === false
                      ? "0 0 8px #ef4444"
                      : "0 0 8px #f59e0b",
                }}
              />
              {serverOnline === true
                ? "API Online"
                : serverOnline === false
                ? "API Offline"
                : "Connecting..."}
            </div>

            {/* History Drawer Trigger */}
            <button
              className="btn-icon"
              onClick={() => setHistoryOpen(true)}
              title="View explanation history"
              aria-label="View explanation history"
              id="btn-history"
              style={{ position: "relative" }}
            >
              <History size={18} />
              {history.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    right: "3px",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    background: "#6366f1",
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Controls Bar: Language Dropdown & Mode Selector */}
        <section className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
          <div className="controls-bar">
            <LanguageSelect
              selectedLanguage={language}
              onChange={setLanguage}
            />
            <ModeSelector
              selectedMode={mode}
              onChange={setMode}
            />
          </div>
        </section>

        {/* Two-Column Editor & Output Grid */}
        <div className="workspace-grid">
          {/* Left Column: Code Editor */}
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            mode={mode}
            onSubmit={handleSubmit}
            onClear={handleClear}
            onLoadExample={handleLoadExample}
            loading={loading}
            theme={theme}
          />

          {/* Right Column: AI Explanation Panel */}
          <section className="glass-panel" style={{ flex: 1 }}>
            <div className="panel-header">
              <div className="panel-title-group">
                <Bot size={20} color="#818cf8" />
                <h2 className="panel-title">AI Explanation</h2>
              </div>
              {explanation && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {explanation.language} · {explanation.mode}
                </span>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <ErrorBanner
                error={error}
                onRetry={retryLastRequest}
                onDismiss={() => setError(null)}
              />
            )}

            {/* Loading Skeleton */}
            {loading && <Loader mode={mode} />}

            {/* Structured Explanation View */}
            {!loading && explanation && <ExplanationView data={explanation} />}

            {/* Empty State when no explanation is active */}
            {!loading && !explanation && !error && (
              <div className="output-empty-state">
                <div className="empty-icon-bubble">
                  <BookOpen size={30} />
                </div>
                <h3 className="empty-title">Ready to Explain Your Code</h3>
                <p className="empty-desc">
                  Paste any code snippet on the left, pick your target audience level, and click{" "}
                  <strong>Explain Code</strong> to receive a structured analysis.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="btn-secondary"
                    onClick={handleLoadExample}
                    id="btn-empty-load-example"
                  >
                    <Sparkles size={14} color="#818cf8" />
                    <span>Try a Sample Snippet</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* History Slide-Out Drawer */}
      <HistoryPanel
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
        onClear={clearHistory}
      />
    </div>
  );
}
