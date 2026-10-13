import { useState, useCallback, useRef } from "react";
import { explainCode } from "../services/api";
import { useLocalStorage } from "./useLocalStorage";

const MAX_HISTORY_ITEMS = 10;

export function useExplain() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [history, setHistory] = useLocalStorage("explain_my_code_history", []);

  // Track the last parameters used so the user can easily click "Retry"
  const lastRequestParamsRef = useRef(null);

  const requestExplanation = useCallback(
    async ({ code, language, mode }) => {
      if (!code || !code.trim()) {
        setError({
          code: "VALIDATION_ERROR",
          message: "Please enter or paste some code to explain.",
        });
        return;
      }

      lastRequestParamsRef.current = { code, language, mode };
      setLoading(true);
      setError(null);

      try {
        const result = await explainCode({ code, language, mode });
        setExplanation(result);

        // Save to history (last 10 items)
        const historyEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          codeSnippet: code.slice(0, 160) + (code.length > 160 ? "..." : ""),
          fullCode: code,
          language: result.language || language,
          mode: result.mode || mode,
          result,
        };

        setHistory((prevHistory) => {
          const filtered = prevHistory.filter(
            (item) => item.fullCode !== code || item.mode !== mode
          );
          return [historyEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        });

        return result;
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [setHistory]
  );

  const retryLastRequest = useCallback(() => {
    if (lastRequestParamsRef.current) {
      requestExplanation(lastRequestParamsRef.current);
    }
  }, [requestExplanation]);

  const clearExplanation = useCallback(() => {
    setExplanation(null);
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const restoreFromHistory = useCallback((historyItem) => {
    setExplanation(historyItem.result);
    setError(null);
  }, []);

  return {
    loading,
    error,
    explanation,
    history,
    requestExplanation,
    retryLastRequest,
    clearExplanation,
    clearHistory,
    restoreFromHistory,
    setExplanation,
    setError,
  };
}
