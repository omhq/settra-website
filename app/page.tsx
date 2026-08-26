"use client";

/* eslint-disable @next/next/no-img-element -- vinext's current next/image shim breaks client hydration. */

import { useSyncExternalStore } from "react";

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
      "Find overdue items in an operations tracker and return the rows that need follow-up.",
  },
  {
    prompt: "How are we tracking?",
    answer:
      "Summarize this month’s sales pipeline and compare actual values with targets.",
  },
  {
    prompt: "What changed?",
    answer:
      "Identify changed rows without asking an agent to understand a fragile source file every time.",
  },
  {
    prompt: "What does this metric mean?",
    answer:
      "Reuse approved definitions like active customer or recognized revenue across later queries.",
  },
];

const capabilities = [
  {
    icon: "↻",
    title: "Reliable by construction",
    body: "The last successful snapshot stays available while a new one is staged, so a failed refresh does not strand your workflows.",
  },
  {
    icon: "⌘",
    title: "Focused agent context",
    body: "Collections group related data into clear workspaces. Each agent loads the right context once and queries only what belongs there.",
  },
  {
    icon: "◇",
    title: "Governed semantics",
    body: "Approved measures and business definitions replace one-off interpretations, making repeated questions far more consistent.",
  },
  {
    icon: "◎",
    title: "Private by default",
    body: "Connections, semantic assets, MCP grants, and request metrics are isolated by workspace. Request and response contents are not stored.",
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
        <a className="wordmark" href="#top" aria-label="Settra home">
          <img
            className="logo logo-light"
            src="/settra-logo-light.png"
            alt="Settra"
          />
          <img
            className="logo logo-dark"
            src="/settra-logo-dark.png"
            alt="Settra"
          />
        </a>

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
              Open source under Apache 2.0
              <span aria-hidden="true">→</span>
            </a>
            <h1>Turn operational files into data your agents can trust.</h1>
            <p className="hero-copy">
              Settra syncs Google Sheets, CSV, Excel, and Parquet files into
              durable PostgreSQL snapshots—then gives AI agents governed access
              through MCP.
            </p>
            <div className="hero-actions">
              <a className="button" href={`${APP_URL}/register`}>
                Start using Settra <span aria-hidden="true">→</span>
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
                Let agents work with the data you already run on.
              </h2>
              <p>
                Replace brittle file-reading workflows with a stable data layer
                that automated agents can discover and query repeatedly.
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

        <section className="capabilities-section">
          <div className="container">
            <header className="section-header">
              <p>
                Give agents enough access to be useful without handing over raw
                source credentials, unrestricted SQL, or inconsistent
                definitions.
              </p>
            </header>

            <div className="capabilities-grid">
              {capabilities.map((capability) => (
                <article className="capability-card" key={capability.title}>
                  <span className="capability-icon" aria-hidden="true">
                    {capability.icon}
                  </span>
                  <h3>{capability.title}</h3>
                  <p>{capability.body}</p>
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
              <h2 id="security-title">Run it where your data belongs.</h2>
              <p className="security-copy">
                Self-host Settra inside infrastructure you control, or use a
                managed deployment when you want the operational work handled
                for you.
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
                  <strong>Workspace isolation</strong>
                  <p>
                    Connections, collections, semantics, grants, and metrics
                    stay scoped to their workspace.
                  </p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>Encrypted authorization</strong>
                  <p>
                    Google OAuth refresh tokens are encrypted per workspace with
                    deployment-held key material.
                  </p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>Privacy-safe history</strong>
                  <p>
                    MCP request and response contents are not stored; only
                    operational usage metrics are retained.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-card">
            <h2>Give your agents data that holds up.</h2>
            <p>
              Start with the operational files your team already trusts. Settra
              turns them into durable, governed context for automated work.
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
            />
            <img
              className="logo footer-logo logo-dark"
              src="/settra-logo-dark.png"
              alt="Settra"
            />
            <p>Durable data for AI agents.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#security">Security</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
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
