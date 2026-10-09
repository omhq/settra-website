"use client";

/* eslint-disable @next/next/no-img-element -- vinext's current next/image shim breaks client hydration. */

import { useSyncExternalStore } from "react";
import Link from "next/link";

const APP_URL = "https://app.settra.io";
const GITHUB_URL = "https://github.com/omhq/settra";
const DESIGN_PARTNER_URL =
  "mailto:support@outermeasure.com?subject=Settra%20design%20partner";
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

function ChevronIcon() {
  return (
    <svg className="faq-chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path d="m6 3 5 5-5 5" />
    </svg>
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
            <a className="nav-link" href="#how-it-works">
              How it works
            </a>
            <a className="nav-link" href="/connect">
              Connect your AI
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
          <a className="button button-small" href="#design-partners">
            Help shape Settra
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-inner">
            <h1>Save the method behind your reports.</h1>
            <p className="hero-copy">
              Use ChatGPT or Claude to turn your Google Sheets and spreadsheet
              files into reusable data artifacts. Keep the sources,
              calculations, and rules together, then rerun them when the data
              changes.
            </p>
            <div className="hero-actions">
              <a className="button" href="#design-partners">
                Help shape Settra <span aria-hidden="true">→</span>
              </a>
              <a className="button button-outline" href="#how-it-works">
                See how it works
              </a>
            </div>
          </div>
        </section>

        <section
          className="report-section"
          id="how-it-works"
          aria-labelledby="report-title"
        >
          <div className="container report-grid">
            <div className="report-copy">
              <h2 id="report-title">Keep how the answer was made.</h2>
              <p>
                A saved answer captures one moment. An artifact saves the method
                that produced it: which data to use, what to calculate, and
                which inputs can change. Review it, refine it when needed, and
                use it again with fresh data.
              </p>

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
                <a
                  className="github-link"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="github-icon"
                    src="/GitHub_Invertocat_Black.svg"
                    alt=""
                    width="98"
                    height="96"
                  />
                  <span>View source on GitHub</span>
                </a>
              </div>
            </div>

            <ol className="report-benefits" aria-label="How to use Settra">
              <li>
                <strong>Connect your data</strong>
                <p>
                  Select the spreadsheet files in Google Drive you want Settra
                  to use.
                </p>
              </li>
              <li>
                <strong>Create an artifact in chat</strong>
                <p>
                  Work with ChatGPT or Claude to define the report and check its
                  calculations.
                </p>
              </li>
              <li>
                <strong>Run it again</strong>
                <p>
                  Use the saved method when the data or reporting period
                  changes.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="reuse-section" aria-labelledby="reuse-title">
          <div className="container reuse-copy">
            <h2 id="reuse-title">One artifact. More ways to use it.</h2>
            <p>
              Use artifacts in ChatGPT or Claude today. We’re building toward
              combining them into web dashboards and delivering selected results
              through Slack, Microsoft Teams, and email. The same saved method
              behind every view.
            </p>
          </div>
          <figure className="container workflow-figure">
            <a
              className="workflow-graphic"
              href="/graphic-canvas.svg"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/graphic-canvas.svg"
                alt="A question in chat becomes a saved revenue artifact, which can feed a dashboard, an email, and a Teams message. Open the full-size diagram."
                width="1144"
                height="536"
                loading="lazy"
                decoding="async"
              />
            </a>
          </figure>
        </section>

        <section
          className="cta-section"
          id="design-partners"
          aria-labelledby="partner-title"
        >
          <div className="container cta-card">
            <h2 id="partner-title">Help shape Settra around a real report.</h2>
            <p>
              Do you prepare a weekly or monthly report from spreadsheets? I’m
              looking for a few people to help shape Settra around that work.
              We’ll start with a conversation about your process. If there’s a
              fit, we can try building one reusable artifact together and see
              what helps, and what still needs work.
            </p>
            <div className="cta-actions">
              <a className="button button-inverse" href={DESIGN_PARTNER_URL}>
                Tell me about your report <span aria-hidden="true">→</span>
              </a>
              <a className="cta-login" href={`${APP_URL}/login`}>
                Already using Settra? Sign in
              </a>
            </div>
          </div>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <div className="container faq-inner">
            <h2 id="faq-title">Frequently asked questions</h2>
            <details>
              <summary>
                <ChevronIcon />
                <span>Where do I use Settra?</span>
              </summary>
              <p>
                In ChatGPT or Claude, connected to Settra through MCP. There’s
                no built-in chat interface yet. The{" "}
                <a href="/connect">connection guide</a> explains the setup and
                account requirements.
              </p>
            </details>
            <details>
              <summary>
                <ChevronIcon />
                <span>What does an artifact save?</span>
              </summary>
              <p>
                A definition of how to produce a result from your data.
                Artifacts are stored as YAML, with the sources, calculation
                rules, and inputs needed to run them again. Each run produces a
                new result.
              </p>
            </details>
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
            <p>Save the method. Rerun the report.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="/connect">Connect your AI</a>
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
