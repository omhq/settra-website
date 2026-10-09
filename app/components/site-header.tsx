"use client";

/* eslint-disable @next/next/no-img-element -- vinext's current next/image shim breaks client hydration. */

import { useSyncExternalStore } from "react";
import Link from "next/link";

const APP_URL = "https://app.settra.io";
const THEME_KEY = "settra-site-theme";
const THEME_EVENT = "settra-site-theme-change";

type SiteHeaderProps = {
  solid?: boolean;
};

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

export function SiteHeader({ solid = false }: SiteHeaderProps) {
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
    <header className={`site-header${solid ? " legal-site-header" : ""}`}>
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
          <Link className="nav-link" href="/#how-it-works">
            How it works
          </Link>
          <Link className="nav-link" href="/connect">
            Connect your AI
          </Link>
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
        </nav>
        <Link className="button button-small" href="/contact">
          Help shape Settra
        </Link>
      </div>
    </header>
  );
}
