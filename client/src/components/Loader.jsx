import React, { useEffect, useState } from "react";
import { Sparkles, Brain, Cpu, Search } from "lucide-react";

const TIPS = [
  "Parsing syntactic structure and AST...",
  "Analyzing control flow and variable lifetimes...",
  "Calculating Big-O time and space complexity bounds...",
  "Structuring conceptual breakdown for your selected mode...",
  "Synthesizing idiomatic recommendations and edge cases...",
];

export default function Loader({ mode }) {
  const [tipIndex, setTipIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 2800);

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(tipInterval);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="skeleton-container" id="ai-loading-skeleton">
      <div className="loading-indicator">
        <div className="spinner" />
        <span>
          Analyzing code in <strong>{mode}</strong> mode ({seconds}s)...
        </span>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.82rem",
          color: "var(--text-secondary)",
          minHeight: "1.2rem",
          marginBottom: "0.5rem",
        }}
      >
        {TIPS[tipIndex]}
      </p>

      {/* Skeleton overview card */}
      <div className="skeleton-card">
        <div className="skeleton-bar w-50" />
        <div className="skeleton-bar w-100" />
        <div className="skeleton-bar w-75" />
      </div>

      {/* Skeleton steps */}
      <div className="skeleton-card" style={{ height: "130px" }}>
        <div className="skeleton-bar w-50" />
        <div className="skeleton-bar w-100" />
        <div className="skeleton-bar w-100" />
        <div className="skeleton-bar w-75" />
      </div>

      {/* Skeleton concepts grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div className="skeleton-card" style={{ height: "80px" }}>
          <div className="skeleton-bar w-50" />
          <div className="skeleton-bar w-75" />
        </div>
        <div className="skeleton-card" style={{ height: "80px" }}>
          <div className="skeleton-bar w-50" />
          <div className="skeleton-bar w-75" />
        </div>
      </div>
    </div>
  );
}
