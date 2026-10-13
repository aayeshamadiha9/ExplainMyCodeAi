import React, { useEffect, useState } from "react";
import { getMeta } from "../services/api";

const DEFAULT_LANGUAGES = [
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

export default function LanguageSelect({ selectedLanguage, onChange }) {
  const [languages, setLanguages] = useState(DEFAULT_LANGUAGES);

  useEffect(() => {
    let isMounted = true;
    async function loadMeta() {
      try {
        const meta = await getMeta();
        if (isMounted && meta && Array.isArray(meta.languages)) {
          setLanguages(meta.languages);
        }
      } catch (err) {
        // Fall back to DEFAULT_LANGUAGES
      }
    }
    loadMeta();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="control-item">
      <label htmlFor="language-select" className="control-label">
        Language
      </label>
      <select
        id="language-select"
        className="custom-select"
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="auto">⚡ Auto-detect Language</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
