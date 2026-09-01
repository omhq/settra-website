/* eslint-disable @next/next/no-img-element -- vinext's current next/image shim breaks client hydration. */

import type { ReactNode } from "react";
import Link from "next/link";

const APP_URL = "https://app.settra.io";
const SUPPORT_EMAIL = "support@outermeasure.com";

type LegalPageProps = {
  title: string;
  description: string;
  dateLabel?: string | null;
  children: ReactNode;
};

export function LegalPage({
  title,
  description,
  dateLabel = "Effective August 27, 2026",
  children,
}: LegalPageProps) {
  return (
    <div className="site-shell legal-shell">
      <header className="site-header legal-site-header">
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
          <Link className="nav-link" href="/">
            Home
          </Link>
          <a className="nav-link sign-in-link" href={APP_URL + "/login"}>
            Sign in
          </a>
          <a className="button button-small" href={APP_URL + "/register"}>
            Get started
          </a>
        </div>
      </header>

      <main className="legal-main">
        <article className="container legal-document">
          <header className="legal-title">
            <h1>{title}</h1>
            <p>{description}</p>
            {dateLabel && <p className="legal-date">{dateLabel}</p>}
          </header>
          {children}
        </article>
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
          <nav aria-label="Legal navigation">
            <a href="/connect">Connect</a>
            <a href="/support">Support</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href={"mailto:" + SUPPORT_EMAIL}>Email</a>
          </nav>
          <p className="copyright">
            © {new Date().getFullYear()} Settra. Apache 2.0.
          </p>
        </div>
      </footer>
    </div>
  );
}
