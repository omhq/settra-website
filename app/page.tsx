"use client";

/* eslint-disable @next/next/no-img-element -- vinext's current next/image shim breaks client hydration. */

import { useSyncExternalStore } from "react";
import Link from "next/link";

const APP_URL = "https://app.settra.io";
const GITHUB_URL = "https://github.com/omhq/settra";
const THEME_KEY = "settra-site-theme";
const THEME_EVENT = "settra-site-theme-change";

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

const workflows = [
  {
    prompt: "What needs attention?",
    answer:
      "Ask an agent to find overdue items in a tracker and return the rows that need follow-up.",
  },
  {
    prompt: "How are we tracking?",
    answer:
      "Compare this month’s sales pipeline with targets without uploading the spreadsheet again.",
  },
  {
    prompt: "What changed?",
    answer:
      "Let an automation check the latest rows whenever it runs through the same MCP connection.",
  },
  {
    prompt: "What does this metric mean?",
    answer:
      "Keep shared definitions like active customer or recognized revenue consistent across every agent.",
  },
];

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
            <a className="nav-link" href="#security">
              Security
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
            <span aria-hidden="true">{dark ? "☀" : "◐"}</span>
          </button>
          <a className="button button-small" href={`${APP_URL}/register`}>
            Get started
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-inner">
            <a
              className="announcement"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span className="spark" aria-hidden="true">
                ✦
              </span>
              Open source
              <span aria-hidden="true">→</span>
            </a>
            <h1>Query your sheet data from any agent.</h1>
            <p className="hero-copy">
              Settra keeps Google Sheets, Excel, and CSV data ready for Codex,
              ChatGPT, Claude, and custom agents.
            </p>
            <div className="hero-actions">
              <a className="button" href={`${APP_URL}/register`}>
                Get started <span aria-hidden="true">→</span>
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

        <section className="workflow-section" aria-labelledby="workflow-title">
          <div className="container">
            <header className="section-header">
              <h2 id="workflow-title">
                Give every agent the same spreadsheet data.
              </h2>
              <p>
                Connect a source once. Settra keeps it ready to query, so agents
                and automations can find rows, compare numbers, and answer
                repeat questions whenever they run.
              </p>
            </header>

            <div className="workflow-grid">
              {workflows.map((workflow) => (
                <article className="workflow-item" key={workflow.prompt}>
                  <span className="quote-mark" aria-hidden="true">
                    “
                  </span>
                  <h3>{workflow.prompt}</h3>
                  <p>{workflow.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="security-section"
          id="security"
          aria-labelledby="security-title"
        >
          <div className="container security-grid">
            <div>
              <h2 id="security-title">
                Use managed storage, or bring your own database.
              </h2>
              <p className="security-copy">
                Start quickly with Settra managed PostgreSQL, or connect your
                own PostgreSQL database when you want full control over where
                staged data lives.
              </p>
              <a
                className="text-link"
                href={`${GITHUB_URL}/blob/main/SELF-HOSTING.md`}
                target="_blank"
                rel="noreferrer"
              >
                Read the self-hosting guide <span aria-hidden="true">→</span>
              </a>
            </div>

            <ul className="security-list">
              <li>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>Separate workspaces</strong>
                  <p>
                    Each workspace keeps its connections, agent access, and
                    usage separate.
                  </p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>Secure Google access</strong>
                  <p>
                    Google connection tokens are encrypted and stay inside the
                    Settra deployment you choose.
                  </p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>Private query history</strong>
                  <p>
                    Settra records usage metrics, not the questions your agents
                    ask or the answers they receive.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-card">
            <h2>Stop wasting time.</h2>
            <p>
              Connect your data once, then let Codex, ChatGPT, Claude, and
              custom agents query it whenever they need it.
            </p>
            <div className="cta-actions">
              <a className="button button-inverse" href={`${APP_URL}/register`}>
                Create your account <span aria-hidden="true">→</span>
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
            <p>Durable data for AI agents.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#security">Security</a>
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
