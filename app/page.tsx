"use client";

/* eslint-disable @next/next/no-img-element -- vinext's current next/image shim breaks client hydration. */

import { useSyncExternalStore } from "react";
import Link from "next/link";

const APP_URL = "https://app.settra.io";
const GITHUB_URL = "https://github.com/omhq/settra";
const THEME_KEY = "settra-site-theme";
const THEME_EVENT = "settra-site-theme-change";

function ThemeIcon({ dark }: { dark: boolean }) {
  if (dark) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.75" />
        <path d="M12 2.25v2M12 19.75v2M4.2 4.2l1.42 1.42M18.38 18.38l1.42 1.42M2.25 12h2M19.75 12h2M4.2 19.8l1.42-1.42M18.38 5.62 19.8 4.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 15.15A8.15 8.15 0 0 1 8.85 3.5 8.5 8.5 0 1 0 20.5 15.15Z" />
    </svg>
  );
}

function ArtifactComposition() {
  const artifacts = [
    {
      name: "Revenue by region",
      detail: "Saved answer · Refreshes with data",
    },
    {
      name: "Pipeline coverage",
      detail: "Saved answer · Refreshes with data",
    },
    {
      name: "Variance notes",
      detail: "Saved answer · Ready to reuse",
    },
  ];

  return (
    <div
      className="artifact-composition"
      aria-label="Illustration showing three reusable data artifacts combined into one shareable report"
    >
      <div className="artifact-composition-header">
        <div>
          <span>Workspace</span>
          <strong>Quarterly review</strong>
        </div>
        <span className="composition-state">
          <span aria-hidden="true" /> Ready to share
        </span>
      </div>

      <div className="artifact-composition-body">
        <div className="artifact-library">
          <div className="artifact-library-heading">
            <span>Reusable artifacts</span>
            <span>3 selected</span>
          </div>
          <div className="artifact-list">
            {artifacts.map((artifact) => (
              <div className="artifact-source" key={artifact.name}>
                <span className="artifact-source-mark" aria-hidden="true">
                  <span />
                </span>
                <div>
                  <strong>{artifact.name}</strong>
                  <span>{artifact.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="artifact-flow" aria-hidden="true">
          <svg viewBox="0 0 48 240" preserveAspectRatio="none">
            <path d="M0 40 C24 40 24 120 48 120" />
            <path d="M0 120 H48" />
            <path d="M0 200 C24 200 24 120 48 120" />
            <circle cx="47" cy="120" r="3" />
          </svg>
        </div>

        <article className="report-sheet">
          <header className="report-sheet-header">
            <div>
              <span>Example shared report</span>
              <h3>Quarterly revenue review</h3>
            </div>
            <span className="report-sheet-date">Updated today</span>
          </header>

          <div className="report-sheet-metrics">
            <div>
              <span>Revenue</span>
              <strong>$4.8M</strong>
            </div>
            <div>
              <span>Pipeline</span>
              <strong>3.2×</strong>
            </div>
            <div>
              <span>Forecast</span>
              <strong>+6%</strong>
            </div>
          </div>

          <div className="report-chart" aria-hidden="true">
            <div className="report-chart-scale">
              <span>Regional performance</span>
              <span>Q3</span>
            </div>
            <div className="report-chart-bars">
              <span style={{ "--bar-size": "72%" } as React.CSSProperties} />
              <span style={{ "--bar-size": "52%" } as React.CSSProperties} />
              <span style={{ "--bar-size": "84%" } as React.CSSProperties} />
              <span style={{ "--bar-size": "64%" } as React.CSSProperties} />
              <span style={{ "--bar-size": "92%" } as React.CSSProperties} />
              <span style={{ "--bar-size": "76%" } as React.CSSProperties} />
            </div>
          </div>

          <footer className="report-sheet-footer">
            <span>Built from 3 artifacts</span>
            <strong>Share report</strong>
          </footer>
        </article>
      </div>
    </div>
  );
}

function readDarkMode() {
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyDarkMode(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    applyDarkMode(readDarkMode());
    callback();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(THEME_EVENT, handleChange);
  media.addEventListener("change", handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(THEME_EVENT, handleChange);
    media.removeEventListener("change", handleChange);
  };
}

export default function Home() {
  const dark = useSyncExternalStore(
    subscribeToTheme,
    readDarkMode,
    () => false,
  );

  function toggleTheme() {
    const next = !dark;
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    applyDarkMode(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Settra home">
          <img
            className="logo logo-light"
            src="/settra-logo-light.png"
            alt="Settra"
            width="568"
            height="160"
          />
          <img
            className="logo logo-dark"
            src="/settra-logo-dark.png"
            alt="Settra"
            width="568"
            height="160"
          />
        </Link>

        <div className="header-actions">
          <nav className="primary-nav" aria-label="Primary navigation">
            <a className="nav-link" href="/connect">
              Connect
            </a>
            <a
              className="nav-link"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </nav>
          <a className="nav-link sign-in-link" href={`${APP_URL}/login`}>
            Sign in
          </a>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <ThemeIcon dark={dark} />
          </button>
          <a className="button button-small" href={`${APP_URL}/register`}>
            Start building
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-inner">
            <h1>Turn AI answers into reusable data artifacts.</h1>
            <p className="hero-copy">
              Give your team answers they can rerun, share, and build on,
              without starting over each time.
            </p>
            <div className="hero-actions">
              <a className="button" href={`${APP_URL}/register`}>
                Start building <span aria-hidden="true">→</span>
              </a>
              <a
                className="button button-outline"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        <section
          className="report-section"
          id="scheduled-reports"
          aria-labelledby="report-title"
        >
          <div className="container report-grid">
            <div className="report-copy">
              <h2 id="report-title">
                The answer should not disappear in chat.
              </h2>
              <p>
                Turn a business question into a reusable data artifact: ask,
                review, and save the answer, then rerun it when the data changes
                or combine it with other artifacts to build a shared view your
                team can keep using.
              </p>

              <ul className="report-benefits">
                <li>
                  <div>
                    <strong>Ask for the answer you need</strong>
                    <p>
                      Describe the business question in plain language and
                      refine the result with AI.
                    </p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Keep it useful</strong>
                    <p>
                      Rerun the same answer with fresh data instead of starting
                      the analysis again.
                    </p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Share one clear result</strong>
                    <p>
                      Use it in a shared report, a team update, or the next
                      conversation.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="open-source-proof">
                <span>Open source</span>
                <span aria-hidden="true" />
                <a
                  href="https://www.apache.org/licenses/LICENSE-2.0"
                  target="_blank"
                  rel="noreferrer"
                >
                  Apache 2.0
                </a>
                <span aria-hidden="true" />
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                  View source on GitHub
                </a>
              </div>
            </div>

            <ArtifactComposition />
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-card">
            <h2>Give a useful answer a longer life.</h2>
            <p>
              Start with one business question. Save the answer, rerun it as the
              data changes, and build from there.
            </p>
            <div className="cta-actions">
              <a className="button button-inverse" href={`${APP_URL}/register`}>
                Start building <span aria-hidden="true">→</span>
              </a>
              <a className="cta-login" href={`${APP_URL}/login`}>
                Already using Settra? Sign in
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <img
              className="logo footer-logo logo-light"
              src="/settra-logo-light.png"
              alt="Settra"
              width="568"
              height="160"
            />
            <img
              className="logo footer-logo logo-dark"
              src="/settra-logo-dark.png"
              alt="Settra"
              width="568"
              height="160"
            />
            <p>Reusable answers from your data.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="/connect">Connect</a>
            <a href="/support">Support</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href={`${APP_URL}/login`}>Sign in</a>
          </nav>
          <p className="copyright">
            © {new Date().getFullYear()} Settra. Apache 2.0.
          </p>
        </div>
      </footer>
    </div>
  );
}
