import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Sparkles, Code2, AlertCircle } from "lucide-react";

const MAX_CODE_LENGTH = 8000;

// Map user language selections to Monaco editor language identifiers
const LANGUAGE_MONACO_MAP = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  c: "c",
  "c++": "cpp",
  "c#": "csharp",
  go: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  kotlin: "kotlin",
  swift: "swift",
  sql: "sql",
  "html/css": "html",
  bash: "shell",
  auto: "javascript", // Default fallback syntax highlighting
};

export default function CodeEditor({
  code,
  onChange,
  language,
  mode,
  onSubmit,
  onClear,
  onLoadExample,
  loading,
  theme,
}) {
  const [monacoFailed, setMonacoFailed] = useState(false);
  const editorRef = useRef(null);

  const monacoLang =
    LANGUAGE_MONACO_MAP[(language || "auto").toLowerCase()] || "plaintext";
  const monacoTheme = theme === "dark" ? "vs-dark" : "light";

  const codeLength = (code || "").length;
  const isOverLimit = codeLength > MAX_CODE_LENGTH;
  const isNearLimit = codeLength > MAX_CODE_LENGTH * 0.85;
  const isCodeEmpty = !code || !code.trim();

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add keyboard shortcut: Ctrl/Cmd + Enter to trigger submission
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        if (!isCodeEmpty && !isOverLimit && !loading) {
          onSubmit();
        }
      }
    );
  };

  // Keyboard shortcut listener for textarea fallback
  const handleKeyDownTextarea = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isCodeEmpty && !isOverLimit && !loading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="glass-panel" style={{ flex: 1 }}>
      <div className="panel-header">
        <div className="panel-title-group">
          <Code2 size={20} color="#818cf8" />
          <h2 className="panel-title">Source Code Input</h2>
        </div>
        <div className="editor-actions-strip">
          <button
            className="btn-secondary"
            onClick={onLoadExample}
            disabled={loading}
            title="Cycle through example code snippets"
            id="btn-load-example"
          >
            <Sparkles size={14} color="#818cf8" />
            <span>Load Example</span>
          </button>
          <button
            className="btn-secondary"
            onClick={onClear}
            disabled={loading || isCodeEmpty}
            title="Clear editor contents"
            id="btn-clear-code"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="editor-container">
        <div className="editor-header-bar">
          <div className="editor-window-controls">
            <span className="dot-btn dot-red" />
            <span className="dot-btn dot-yellow" />
            <span className="dot-btn dot-green" />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            {language === "auto" ? "Auto-detect syntax" : language}
          </span>
        </div>

        {!monacoFailed ? (
          <div style={{ flex: 1, minHeight: "360px" }}>
            <Editor
              height="100%"
              language={monacoLang}
              value={code}
              theme={monacoTheme}
              onChange={(val) => onChange(val || "")}
              onMount={handleEditorDidMount}
              loading={
                <div style={{ padding: "2rem", color: "var(--text-muted)", textAlign: "center" }}>
                  Loading code editor...
                </div>
              }
              options={{
                fontSize: 14,
                fontFamily: "var(--font-mono)",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                lineNumbers: "on",
                roundedSelection: true,
                padding: { top: 12, bottom: 12 },
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        ) : (
          <textarea
            className="editor-textarea"
            placeholder="// Paste or write your source code here..."
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDownTextarea}
            id="code-editor-textarea"
            spellCheck="false"
          />
        )}
      </div>

      {/* Bottom Bar with Counter & Action Buttons */}
      <div className="editor-bottom-bar">
        <div className="editor-meta-info">
          <span
            className={`char-counter ${
              isOverLimit ? "over-limit" : isNearLimit ? "near-limit" : ""
            }`}
          >
            {codeLength.toLocaleString()} / {MAX_CODE_LENGTH.toLocaleString()} chars
          </span>
          <div className="shortcut-hint">
            <span>Press</span>
            <span className="kbd-badge">Ctrl / ⌘</span>
            <span>+</span>
            <span className="kbd-badge">Enter</span>
            <span>to explain</span>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={onSubmit}
          disabled={loading || isCodeEmpty || isOverLimit}
          id="btn-explain-code"
        >
          <Play size={16} fill="currentColor" />
          <span>{loading ? "Analyzing..." : "Explain Code"}</span>
        </button>
      </div>

      {isOverLimit && (
        <div
          style={{
            marginTop: "0.75rem",
            color: "#ef4444",
            fontSize: "0.82rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <AlertCircle size={15} />
          <span>Code exceeds the maximum length of 8,000 characters. Please trim your snippet.</span>
        </div>
      )}
    </div>
  );
}
