import React, { useEffect, useState } from "react";
import { Sparkles, Moon, Sun, History, Server, Activity } from "lucide-react";
import { getHealthStatus } from "../services/api";

export default function Header({
  theme,
  toggleTheme,
  historyCount,
  onOpenHistory,
}) {
  const [serverOnline, setServerOnline] = useState(null);

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

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="brand-title">Explain My Code AI</h1>
            <p className="brand-tagline">
              Understand any code instantly with Google Gemini
            </p>
          </div>
        </div>

        <div className="header-actions">
          {/* Server Status Pill */}
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

          {/* History Button */}
          <button
            className="btn-icon"
            onClick={onOpenHistory}
            title="View explanation history"
            aria-label="View explanation history"
            id="btn-history"
          >
            <History size={18} />
            {historyCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "14px",
                  height: "14px",
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
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            className="btn-icon"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
            id="btn-theme-toggle"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
