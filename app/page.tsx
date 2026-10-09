/* eslint-disable @next/next/no-img-element -- vinext's current next/image shim breaks client hydration. */

import { SiteHeader } from "./components/site-header";

const APP_URL = "https://app.settra.io";
const GITHUB_URL = "https://github.com/omhq/settra";

function ChevronIcon() {
  return (
    <svg className="faq-chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path d="m6 3 5 5-5 5" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />

      <main id="top">
        <section className="hero">
          <div className="container hero-inner">
            <h1>Define it once. Reuse it across your work.</h1>
            <p className="hero-copy">
              Turn calculations and reports into reusable data artifacts,
              managed together in Settra. Create and run them in ChatGPT or
              Claude today using your Google Sheets and spreadsheet files.
            </p>
            <div className="hero-actions">
              <a className="button" href="/contact">
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
              <h2 id="report-title">
                One source of truth for your calculations.
              </h2>
              <p>
                Each artifact keeps the sources, calculations, rules, and inputs
                behind a result in one maintained definition. Review and refine
                that definition in Settra, then reuse it with fresh data or
                different inputs. Your collection grows with the metrics and
                reports you need.
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
                <strong>Define an artifact</strong>
                <p>
                  Work with ChatGPT or Claude to set its sources, calculations,
                  and inputs, then check the result.
                </p>
              </li>
              <li>
                <strong>Build your collection</strong>
                <p>
                  Save artifacts for the metrics and reports you need. Find and
                  rerun them as your data or inputs change.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="reuse-section" aria-labelledby="reuse-title">
          <div className="container reuse-copy">
            <h2 id="reuse-title">One artifact. More ways to use it.</h2>
            <p>
              The goal is to reuse the same artifacts wherever results are
              needed, with no separate calculation logic to maintain for each
              destination.
            </p>
            <p>
              Use them in ChatGPT or Claude today. We’re building toward
              composing web dashboards from multiple artifacts and delivering
              selected results through Slack, Microsoft Teams, and email.
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
              Do the same calculations end up in several reports or updates? I’m
              looking for people working from spreadsheets to help shape Settra
              around that work. We’ll start with a conversation about your
              process, then try one reusable artifact together if there’s a fit.
            </p>
            <div className="cta-actions">
              <a className="button button-inverse" href="/contact">
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
            <details>
              <summary>
                <ChevronIcon />
                <span>What does “one source of truth” mean?</span>
              </summary>
              <p>
                One maintained definition for each calculation or report. The
                goal is for every use of an artifact to rely on that definition,
                so you don’t have to recreate its logic for each destination.
                Different data, filters, or reporting periods can produce
                different results while using the same definition.
              </p>
            </details>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
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
            <p>Define once. Reuse across your work.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="/connect">Connect your AI</a>
            <a href="/support">Support</a>
            <a href="/contact">Contact</a>
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
