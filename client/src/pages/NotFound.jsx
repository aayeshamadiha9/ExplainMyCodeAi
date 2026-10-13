import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found | Explain My Code AI";
  }, []);

  return (
    <div className="not-found-page">
      <div className="glass-panel not-found-card">
        <div className="not-found-icon-wrap">
          <Compass size={48} color="#818cf8" />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-desc">
          The page or route you are looking for doesn't exist or has moved. Let's get you back to understanding your code.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
          <Link to="/explain" className="btn-secondary">
            <ArrowLeft size={16} />
            <span>Go to Code Explainer</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
