import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

function GitHubIcon({ size = 15, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <div className="brand-icon small">
                <Sparkles size={16} />
              </div>
              <span className="brand-title">Explain My Code AI</span>
            </Link>
            <p className="footer-tagline">
              Understand any code in seconds with structured, AI-powered multi-level explanations.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-nav-col">
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-links-list">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/explain">Explain Code</Link>
                </li>
                <li>
                  <Link to="/explain?mode=beginner">Beginner Mode</Link>
                </li>
                <li>
                  <Link to="/explain?mode=interview">Interview Prep</Link>
                </li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4 className="footer-col-title">Connect</h4>
              <ul className="footer-links-list">
                <li>
                  <a
                    href="https://github.com/aayeshamadiha9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-external-link"
                  >
                    <GitHubIcon size={15} />
                    <span>GitHub Profile</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-external-link"
                  >
                    <span>Google Gemini API</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-credit">
            Built by{" "}
            <a
              href="https://github.com/aayeshamadiha9"
              target="_blank"
              rel="noopener noreferrer"
              className="author-link"
            >
              Aayesha Madiha
            </a>
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Explain My Code AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
