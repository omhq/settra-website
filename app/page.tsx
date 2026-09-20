"use client";

/* eslint-disable @next/next/no-img-element -- vinext's current next/image shim breaks client hydration. */

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { AgentNativeBackdrop } from "./components/agent-native-backdrop";

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
    prompt: "Build with AI",
    answer:
      "Describe the App you need and let AI do the heavy lifting, turning spreadsheet data into something useful in minutes.",
  },
  {
    prompt: "Build once, reuse everywhere",
    answer:
      "Use the same App in chat, on a schedule, or in Settra instead of rebuilding the same report for every workflow.",
  },
  {
    prompt: "Trust every answer",
    answer:
      "Your business rules stay with the App, so agents use the right data and calculations instead of guessing or hallucinating.",
  },
  {
    prompt: "Stay ahead of schema drift",
    answer:
      "See which Apps a spreadsheet change will affect before a renamed, removed, or changed column breaks them.",
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
            <a className="nav-link" href="/connect">
              Connect
            </a>
            <a className="nav-link" href="#why-settra">
              Why Settra
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
          <AgentNativeBackdrop />
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
              Open source · Agent-native
              <span aria-hidden="true">→</span>
            </a>
            <h1>Build agent‑native data apps.</h1>
            <p className="hero-copy text-2xl font-semibold">
              Turn spreadsheet data into reliable mini BI reports with AI. Build
              once, then use the same App in chat, on a schedule, or in Settra.
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

        <section className="workflow-section" aria-labelledby="workflow-title">
          <div className="container">
            <header className="section-header">
              <h2 id="workflow-title">
                Build once. Get reliable answers everywhere.
              </h2>
              <p>
                Settra turns spreadsheet data into reusable data Apps you build
                with AI and deliver as mini BI reports wherever work happens.
              </p>
            </header>

            <div className="workflow-grid">
              {workflows.map((workflow) => (
                <article className="workflow-item" key={workflow.prompt}>
                  <span className="workflow-node" aria-hidden="true">
                    <span />
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
          id="why-settra"
          aria-labelledby="security-title"
        >
          <div className="container security-grid">
            <div>
              <h2 id="security-title">Stop rebuilding the same analysis.</h2>
              <p className="security-copy">
                Create the App once with AI, then deliver dependable mini BI
                reports to people and agents in chat, in Settra, or on any
                schedule.
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
                  <strong>Save hours of repeated work</strong>
                  <p>
                    Turn recurring spreadsheet analysis into an App once and
                    reuse it every time the question comes up.
                  </p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>Keep agents from guessing</strong>
                  <p>
                    Give every agent the same trusted App, so it follows your
                    rules instead of inventing its own interpretation.
                  </p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>Catch schema drift early</strong>
                  <p>
                    See what a spreadsheet change will affect before it breaks
                    the Apps people and agents depend on.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-card">
            <h2>Build the data App once.</h2>
            <p>
              Create it with AI, then deliver reliable mini BI reports in chat,
              on a schedule, or wherever your team already works.
            </p>
            <div className="cta-actions">
              <a className="button button-inverse" href={`${APP_URL}/register`}>
                Build your first App <span aria-hidden="true">→</span>
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
            <p>Agent-native data apps.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#why-settra">Why Settra</a>
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
