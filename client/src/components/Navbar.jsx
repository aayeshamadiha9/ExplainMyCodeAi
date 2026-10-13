import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sparkles, Moon, Sun, Menu, X, Code2, Home } from "lucide-react";

// Crisp inline SVG for GitHub
function GitHubIcon({ size = 19, className = "" }) {
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

export default function Navbar({ theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-navbar" aria-label="Main Navigation">
      <div className="navbar-inner">
        {/* Left: Brand Logo & Title */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <span className="brand-title">Explain My Code AI</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-links-desktop">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/explain"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Explain Code
          </NavLink>

          {/* GitHub Profile Link */}
          <a
            href="https://github.com/aayeshamadiha9"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-icon-link"
            title="GitHub: @aayeshamadiha9"
            aria-label="GitHub Profile (opens in a new tab)"
          >
            <GitHubIcon size={19} />
          </a>

          {/* Theme Toggle Button */}
          <button
            className="btn-icon"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle light/dark theme"
            id="btn-navbar-theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>

        {/* Mobile Actions: Theme Toggle & Hamburger */}
        <div className="navbar-mobile-actions">
          <button
            className="btn-icon"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="btn-icon mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            id="btn-mobile-menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (below 768px) */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer" id="mobile-menu-drawer">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <Home size={18} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/explain"
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <Code2 size={18} />
            <span>Explain Code</span>
          </NavLink>

          <a
            href="https://github.com/aayeshamadiha9"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            <GitHubIcon size={18} />
            <span>GitHub Profile</span>
          </a>
        </div>
      )}
    </header>
  );
}
