/* eslint-disable @next/next/no-img-element -- vinext's current next/image shim breaks client hydration. */

import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";

const SUPPORT_EMAIL = "support@outermeasure.com";

type LegalPageProps = {
  title: string;
  description: string;
  dateLabel?: string | null;
  hideTitle?: boolean;
  mainClassName?: string;
  documentClassName?: string;
  children: ReactNode;
};

export function LegalPage({
  title,
  description,
  dateLabel = "Effective August 27, 2026",
  hideTitle = false,
  mainClassName = "",
  documentClassName = "",
  children,
}: LegalPageProps) {
  return (
    <div className="site-shell legal-shell">
      <SiteHeader solid />

      <main className={`legal-main ${mainClassName}`}>
        <article className={`container legal-document ${documentClassName}`}>
          {!hideTitle && (
            <header className="legal-title">
              <h1>{title}</h1>
              <p>{description}</p>
              {dateLabel && <p className="legal-date">{dateLabel}</p>}
            </header>
          )}
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
            <p>Save the method. Rerun the report.</p>
          </div>
          <nav aria-label="Legal navigation">
            <a href="/connect">Connect your AI</a>
            <a href="/support">Support</a>
            <a href="/contact">Contact</a>
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
