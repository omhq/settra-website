import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://settra.io"),
  title: {
    default: "Settra — Durable data for AI agents",
    template: "%s | Settra",
  },
  description:
    "Connect Google Sheets, Excel, and CSV data once, then query it from Codex, ChatGPT, Claude, or custom agents through MCP.",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Settra",
    title: "Settra — Durable data for AI agents",
    description:
      "Connect Google Sheets, Excel, and CSV data once, then query it from Codex, ChatGPT, Claude, or custom agents through MCP.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Settra — Durable data for AI agents.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Settra — Durable data for AI agents",
    description:
      "Connect Google Sheets, Excel, and CSV data once, then query it from Codex, ChatGPT, Claude, or custom agents through MCP.",
    images: ["/og.png"],
  },
};

const themeScript = `
  try {
    const stored = localStorage.getItem("settra-site-theme");
    const dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
