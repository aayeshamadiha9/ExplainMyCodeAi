import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Explainer from "./pages/Explainer";
import NotFound from "./pages/NotFound";
import { useLocalStorage } from "./hooks/useLocalStorage";

/**
 * Automatically scrolls to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [theme, setTheme] = useLocalStorage("explain_my_code_theme", "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <ScrollToTop />

        {/* Shared Top Navbar on Every Page */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* Main Routed Content */}
        <div className="app-page-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explain" element={<Explainer theme={theme} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Shared Footer on Every Page */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
