import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  Baby,
  Compass,
  Briefcase,
  ListOrdered,
  Lightbulb,
  Gauge,
  AlertTriangle,
  HelpCircle,
  Download,
  FileCode2,
  CheckCircle2,
  ChevronRight,
  Zap,
} from "lucide-react";

const SUPPORTED_LANGUAGES = [
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

export default function Home() {
  useEffect(() => {
    document.title = "Explain My Code AI | Understand Any Code in Seconds";
  }, []);

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    const elem = document.getElementById("how-it-works");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section" aria-label="Hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} color="#818cf8" />
              <span>Next-Gen Code Intelligence</span>
            </div>

            <h1 className="hero-title">
              Understand any code <span className="gradient-text">in seconds.</span>
            </h1>

            <p className="hero-subtitle">
              Paste your source code, choose your explanation depth, and receive a crystal-clear,
              structured breakdown powered by the Google Gemini API.
            </p>

            <div className="hero-cta-group">
              <Link to="/explain" className="btn-primary hero-btn" id="hero-btn-try-now">
                <span>Try it now</span>
                <ArrowRight size={17} />
              </Link>
              <a
                href="#how-it-works"
                onClick={scrollToHowItWorks}
                className="btn-secondary hero-btn"
                id="hero-btn-see-how"
              >
                <span>See how it works</span>
              </a>
            </div>

            <div className="hero-trust-indicators">
              <span className="trust-item">
                <CheckCircle2 size={14} color="#10b981" />
                <span>Zero Setup Required</span>
              </span>
              <span className="trust-item">
                <CheckCircle2 size={14} color="#10b981" />
                <span>16+ Languages + Auto-detect</span>
              </span>
              <span className="trust-item">
                <CheckCircle2 size={14} color="#10b981" />
                <span>Structured Markdown Export</span>
              </span>
            </div>
          </div>

          {/* Hero Visual: Styled Mock Code -> Explanation Preview Card */}
          <div className="hero-visual" aria-hidden="true">
            <div className="mock-preview-container">
              {/* Mock Input Side */}
              <div className="mock-side mock-editor-side">
                <div className="mock-card-header">
                  <div className="mock-dots">
                    <span className="mock-dot dot-red" />
                    <span className="mock-dot dot-yellow" />
                    <span className="mock-dot dot-green" />
                  </div>
                  <span className="mock-lang-tag">Python · recursion</span>
                </div>
                <div className="mock-code-body">
                  <pre>
                    <code>{`def fib(n, memo={}):
  if n in memo:
    return memo[n]
  if n <= 1:
    return n
  memo[n] = fib(n-1) + fib(n-2)
  return memo[n]`}</code>
                  </pre>
                </div>
              </div>

              {/* Arrow Connector */}
              <div className="mock-connector-badge">
                <Zap size={14} color="#ffffff" />
              </div>

              {/* Mock Explanation Output Side */}
              <div className="mock-side mock-output-side">
                <div className="mock-card-header">
                  <span className="mock-badge-mode">Intermediate Mode</span>
                  <span className="mock-badge-complexity">O(n) Time</span>
                </div>
                <div className="mock-explanation-body">
                  <div className="mock-exp-block">
                    <strong className="mock-exp-heading">Executive Overview</strong>
                    <p className="mock-exp-text">
                      Computes the n-th Fibonacci value using top-down recursion with memoization to eliminate redundant subproblem evaluation.
                    </p>
                  </div>
                  <div className="mock-exp-block">
                    <strong className="mock-exp-heading">Key Concept</strong>
                    <div className="mock-concept-tag">Memoization Caching</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="section-container" id="how-it-works" aria-labelledby="heading-how-it-works">
        <div className="section-header">
          <span className="section-kicker">Simple 3-Step Workflow</span>
          <h2 className="section-title" id="heading-how-it-works">
            How Explain My Code AI Works
          </h2>
          <p className="section-desc">
            Transform confusing algorithms into intuitive understanding without cognitive friction.
          </p>
        </div>

        <div className="steps-grid">
          {/* Step 1 */}
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon-bubble">
              <FileCode2 size={24} color="#818cf8" />
            </div>
            <h3 className="step-title">Paste Your Code</h3>
            <p className="step-desc">
              Drop any snippet into the Monaco code editor. Support for 16+ programming languages or instant automatic syntax detection.
            </p>
          </div>

          {/* Step 2 */}
          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon-bubble">
              <Compass size={24} color="#38bdf8" />
            </div>
            <h3 className="step-title">Choose Language & Level</h3>
            <p className="step-desc">
              Select between Beginner, Intermediate, Advanced, or Technical Interview modes to tailor depth, tone, and complexity.
            </p>
          </div>

          {/* Step 3 */}
          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-bubble">
              <Sparkles size={24} color="#ec4899" />
            </div>
            <h3 className="step-title">Get Structured Explanation</h3>
            <p className="step-desc">
              Gemini returns a clean, modular breakdown with line-by-line steps, Big-O complexity bounds, potential bugs, and follow-up Q&A.
            </p>
          </div>
        </div>
      </section>

      {/* 3. EXPLANATION MODES SECTION */}
      <section className="section-container" id="modes" aria-labelledby="heading-modes">
        <div className="section-header">
          <span className="section-kicker">Tailored Understanding</span>
          <h2 className="section-title" id="heading-modes">
            Four Dedicated Explanation Modes
          </h2>
          <p className="section-desc">
            Different problems require different lenses. Choose the perfect level for your needs.
          </p>
        </div>

        <div className="modes-grid">
          {/* Beginner Card */}
          <div className="mode-card mode-card-beginner">
            <div className="mode-card-top">
              <div className="mode-icon-wrap beginner">
                <Baby size={22} />
              </div>
              <span className="mode-badge-tag beginner">Beginner</span>
            </div>
            <h3 className="mode-card-title">Zero Jargon & Intuitive Analogies</h3>
            <p className="mode-card-desc">
              Plain language, everyday analogies, no unneeded buzzwords. Patiently explains foundational concepts so anyone can understand what the code does.
            </p>
            <Link
              to="/explain?mode=beginner"
              className="mode-card-link"
              id="link-mode-beginner"
            >
              <span>Try this mode</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Intermediate Card */}
          <div className="mode-card mode-card-intermediate">
            <div className="mode-card-top">
              <div className="mode-icon-wrap intermediate">
                <Compass size={22} />
              </div>
              <span className="mode-badge-tag intermediate">Intermediate</span>
            </div>
            <h3 className="mode-card-title">Logic Flow & Practical Reasoning</h3>
            <p className="mode-card-desc">
              Assumes foundational programming knowledge. Focuses closely on logic, execution flow, variable transformations, and why the code was written this way.
            </p>
            <Link
              to="/explain?mode=intermediate"
              className="mode-card-link"
              id="link-mode-intermediate"
            >
              <span>Try this mode</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Advanced Card */}
          <div className="mode-card mode-card-advanced">
            <div className="mode-card-top">
              <div className="mode-icon-wrap advanced">
                <Cpu size={22} />
              </div>
              <span className="mode-badge-tag advanced">Advanced</span>
            </div>
            <h3 className="mode-card-title">Deep Technical Internals & Big-O</h3>
            <p className="mode-card-desc">
              Deep architectural detail, time & space Big-O complexity, corner cases, architectural trade-offs, potential bottlenecks, and idiomatic optimizations.
            </p>
            <Link
              to="/explain?mode=advanced"
              className="mode-card-link"
              id="link-mode-advanced"
            >
              <span>Try this mode</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Interview Card */}
          <div className="mode-card mode-card-interview">
            <div className="mode-card-top">
              <div className="mode-icon-wrap interview">
                <Briefcase size={22} />
              </div>
              <span className="mode-badge-tag interview">Interview</span>
            </div>
            <h3 className="mode-card-title">Candidate Walkthrough & Q&A Prep</h3>
            <p className="mode-card-desc">
              Explains code the way a strong candidate would in a FAANG technical interview, adding 3–5 realistic follow-up questions with model answers.
            </p>
            <Link
              to="/explain?mode=interview"
              className="mode-card-link"
              id="link-mode-interview"
            >
              <span>Try this mode</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID SECTION */}
      <section className="section-container" id="features" aria-labelledby="heading-features">
        <div className="section-header">
          <span className="section-kicker">Everything You Need</span>
          <h2 className="section-title" id="heading-features">
            Structured Insights, Not Walls of Text
          </h2>
          <p className="section-desc">
            Engineered to present information in scannable, actionable sections.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap">
              <ListOrdered size={20} color="#38bdf8" />
            </div>
            <h3 className="feature-title">Line-by-Line Walkthrough</h3>
            <p className="feature-desc">
              Discrete line range badges pinpointing exactly what occurs at each stage of execution.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <Lightbulb size={20} color="#f59e0b" />
            </div>
            <h3 className="feature-title">Key Concepts Explained</h3>
            <p className="feature-desc">
              Highlighting design patterns, recursion, closures, concurrency, and algorithmic paradigms.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <Gauge size={20} color="#06b6d4" />
            </div>
            <h3 className="feature-title">Time & Space Complexity</h3>
            <p className="feature-desc">
              Precise asymptotic Big-O notations paired with crisp justifications for memory and runtime.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <AlertTriangle size={20} color="#f43f5e" />
            </div>
            <h3 className="feature-title">Potential Issues & Improvements</h3>
            <p className="feature-desc">
              Uncovering hidden corner cases, memory leaks, unhandled exceptions, and clean refactoring advice.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <HelpCircle size={20} color="#fbbf24" />
            </div>
            <h3 className="feature-title">Interview Follow-up Q&A</h3>
            <p className="feature-desc">
              Interactive accordion containing rigorous follow-up questions and sharp, model answers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <Download size={20} color="#10b981" />
            </div>
            <h3 className="feature-title">Copy & Export as Markdown</h3>
            <p className="feature-desc">
              One-click clipboard copy or download structured <code>.md</code> documentation directly.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SUPPORTED LANGUAGES CHIPS */}
      <section className="section-container languages-section" aria-label="Supported Languages">
        <div className="section-header">
          <span className="section-kicker">Multi-Language Ecosystem</span>
          <h2 className="section-title">Works With Your Entire Stack</h2>
          <p className="section-desc">
            Seamlessly handles both popular languages and specialized syntaxes.
          </p>
        </div>

        <div className="languages-chips-wrapper">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <span key={lang} className="lang-chip">
              <Code2 size={13} />
              <span>{lang}</span>
            </span>
          ))}
          <span className="lang-chip chip-highlight">
            <Sparkles size={13} />
            <span>and auto-detect</span>
          </span>
        </div>
      </section>

      {/* 6. CALL-TO-ACTION BAND */}
      <section className="cta-banner-section" aria-label="Call to Action">
        <div className="cta-banner-card">
          <div className="cta-banner-content">
            <h2 className="cta-title">Ready to understand your code?</h2>
            <p className="cta-subtitle">
              Paste your first snippet and see the power of structured AI explanations in action.
            </p>
          </div>
          <Link to="/explain" className="btn-primary cta-btn" id="cta-btn-start">
            <span>Start explaining</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
