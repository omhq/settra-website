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

const workflowSteps = [
  {
    icon: "connect",
    prompt: "Connect",
    answer:
      "Connect your data from flat files, cloud storage, or Google Drive.",
  },
  {
    icon: "describe",
    prompt: "Describe the outcome",
    answer:
      "Tell AI what the report should answer, who it is for, and which inputs should stay adjustable.",
  },
  {
    icon: "approve",
    prompt: "Approve",
    answer:
      "Review the proposed metrics, joins, calculations, and assumptions before they become the App's shared definition.",
  },
  {
    icon: "test",
    prompt: "Test",
    answer:
      "Run it with real data, change its parameters, and ask follow-up questions until the answer is useful.",
  },
  {
    icon: "reuse",
    prompt: "Reuse and Automate",
    answer:
      "Use the same approved logic in chat, scheduled runs, and agent workflows.",
  },
];

function WorkflowIcon({ icon }: { icon: string }) {
  const paths = {
    connect: (
      <>
        <path d="M7.5 18.5h8.75a4.25 4.25 0 0 0 .73-8.44A5.75 5.75 0 0 0 6.1 11.9 3.35 3.35 0 0 0 7.5 18.5Z" />
        <path d="M12 16V8m0 0-2.75 2.75M12 8l2.75 2.75" />
      </>
    ),
    describe: (
      <>
        <path d="M6.25 6.25h11.5v8.5h-6.5L8 17.5v-2.75H6.25Z" />
        <path d="M9 9.5h6m-6 2.75h4" />
      </>
    ),
    approve: (
      <>
        <circle cx="12" cy="12" r="7.5" />
        <path d="m8.75 12 2.1 2.1 4.4-4.4" />
      </>
    ),
    test: (
      <>
        <path d="M9 4.5h6M10 4.5v5L6.75 16a2.75 2.75 0 0 0 2.45 4h5.6a2.75 2.75 0 0 0 2.45-4L14 9.5v-5" />
        <path d="M8.5 16h7" />
      </>
    ),
    reuse: (
      <>
        <path d="M17 8.25H8.5a3.5 3.5 0 0 0-3.5 3.5v.5" />
        <path d="m14.25 5.5 2.75 2.75L14.25 11" />
        <path d="M7 15.75h8.5a3.5 3.5 0 0 0 3.5-3.5v-.5" />
        <path d="m9.75 18.5-2.75-2.75L9.75 13" />
      </>
    ),
  }[icon];

  return (
    <svg
      className="workflow-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

function ScheduledReportMessage() {
  return (
    <svg
      className="report-message"
      viewBox="0 0 640 520"
      role="img"
      aria-labelledby="report-message-title report-message-description"
    >
      <title id="report-message-title">
        Weekly sales report in a team chat
      </title>
      <desc id="report-message-description">
        Settra posts a Monday pipeline brief with trusted sales metrics to the
        sales reports channel.
      </desc>

      <rect className="message-shell" x="8" y="8" width="624" height="504" rx="22" />
      <path className="message-rail" d="M8 30a22 22 0 0 1 22-22h118v504H30a22 22 0 0 1-22-22Z" />

      <g className="message-rail-copy">
        <circle cx="42" cy="46" r="14" />
        <path d="M35 46h14M42 39v14" />
        <text className="message-workspace-name" x="66" y="51"></text>
        <text className="message-rail-label" x="32" y="102">CHANNELS</text>
        <text className="message-channel-active" x="34" y="138">#  sales-reports</text>
        <text className="message-channel" x="34" y="174">#  revenue-team</text>
        <text className="message-channel" x="34" y="210">#  pipeline</text>
        <text className="message-rail-label" x="32" y="272">DIRECT MESSAGES</text>
        <circle className="message-presence" cx="40" cy="306" r="4" />
        <text className="message-channel" x="52" y="311">You</text>
      </g>

      <g className="message-content">
        <text className="message-title" x="180" y="54">#  sales-reports</text>
        <text className="message-subtitle" x="180" y="78">4 members</text>
        <path className="message-divider" d="M148 96h484" />

        <circle className="message-avatar" cx="190" cy="132" r="21" />
        <text className="message-avatar-letter" x="190" y="139">S</text>
        <text className="message-sender" x="224" y="127">Settra</text>
        <text className="message-time" x="281" y="127">8:00 AM</text>
        <text className="message-copy" x="224" y="151">Here&apos;s your Monday pipeline brief.</text>

        <rect className="message-report-card" x="224" y="170" width="354" height="214" rx="11" />
        <rect className="message-report-accent" x="224" y="170" width="5" height="214" rx="2.5" />
        <text className="message-report-kicker" x="248" y="204">WEEKLY SALES REPORT</text>
        <text className="message-report-title" x="248" y="235">Monday pipeline brief</text>
        <path className="message-card-divider" d="M248 254h304" />
        <text className="message-metric-label" x="248" y="283">Pipeline coverage</text>
        <text className="message-metric-value" x="248" y="315">3.2x</text>
        <text className="message-metric-label" x="365" y="283">Weighted pipeline</text>
        <text className="message-metric-value" x="365" y="315">$1.24m</text>
        <text className="message-metric-label" x="494" y="283">At risk</text>
        <text className="message-metric-value" x="494" y="315">$184k</text>
        <path className="message-card-divider" d="M248 332h304" />
        <text className="message-report-note" x="248" y="357">
          Coverage is above target; four late-stage deals
        </text>
        <text className="message-report-note" x="248" y="375">
          account for most of the quarter&apos;s risk.
        </text>

        <circle className="message-reply-avatar" cx="190" cy="423" r="18" />
        <text className="message-reply-letter" x="190" y="429">M</text>
        <text className="message-sender" x="220" y="419">Maya</text>
        <text className="message-time" x="260" y="419">8:02 AM</text>
        <text className="message-copy" x="220" y="444">Perfect, sharing this with the team.</text>

        <rect className="message-compose" x="174" y="467" width="420" height="27" rx="6" />
        <text className="message-compose-copy" x="189" y="485">
          Message #sales-reports
        </text>
      </g>
    </svg>
  );
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
            <h1>Build data Apps that keep your team informed.</h1>
            <p className="hero-copy text-2xl font-semibold">
              Compose trusted mini BI reports with AI from spreadsheet data.
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
              <h2 id="report-title">Updates arrive before anyone asks.</h2>
              <p>Choose the question, inputs, and audience with AI.</p>

              <ul className="report-benefits">
                <li>
                  <div>
                    <strong>Set reusable inputs</strong>
                    <p>
                      Change the period, region, comparison, or other report
                      parameters without rebuilding the analysis.
                    </p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Automate</strong>
                    <p>
                      Every scheduled run uses the same metrics and business
                      logic baked into the app.
                    </p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Deliver an answer, not another dashboard</strong>
                    <p>
                      Send the numbers and a concise summary to email or Slack.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <ScheduledReportMessage />
          </div>
        </section>

        <section
          className="workflow-section"
          id="how-it-works"
          aria-labelledby="workflow-title"
        >
          <div className="container">
            <header className="section-header">
              <h2 id="workflow-title">
                From spreadsheet to a report you can trust.
              </h2>
              <p>
                Bring the data and business question together once. Settra and
                AI help you compose the App behind the answer, verify it, and
                reuse it without rebuilding the analysis.
              </p>
            </header>

            <ol className="workflow-steps">
              {workflowSteps.map((workflow) => (
                <li className="workflow-step" key={workflow.prompt}>
                  <WorkflowIcon icon={workflow.icon} />
                  <div>
                    <h3>{workflow.prompt}</h3>
                    <p>{workflow.answer}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="security-section"
          id="why-settra"
          aria-labelledby="security-title"
        >
          <div className="container security-grid">
            <div>
              <h2 id="security-title">Trust the report when it arrives.</h2>
              <p className="security-copy">
                Each App keeps the business context behind the answer, so people
                and agents work from the same definitions instead of
                interpreting a spreadsheet from scratch.
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
                    Turn a recurring spreadsheet question into an App and reuse
                    it whenever the report runs or someone asks in chat.
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
            <h2>Build the report together.</h2>
            <p>
              Start with a spreadsheet and a business question. Compose a
              reusable App with AI, then be first to try scheduled delivery.
            </p>
            <div className="cta-actions">
              <a className="button button-inverse" href={`${APP_URL}/register`}>
                Build your first report <span aria-hidden="true">→</span>
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
