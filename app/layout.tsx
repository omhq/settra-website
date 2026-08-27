import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://www.settra.io";
const TITLE = "Settra: Query Google Sheets & Excel with AI Agents";
const DESCRIPTION =
  "Connect Google Sheets, Excel, and CSV files once. Let Codex, ChatGPT, Claude, and custom AI agents query reliable spreadsheet data through MCP.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Settra",
  title: {
    default: TITLE,
    template: "%s | Settra",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  authors: [{ name: "Settra", url: SITE_URL }],
  creator: "Settra",
  publisher: "Settra",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Settra",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Settra — durable spreadsheet data for AI agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Settra",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.png`,
      sameAs: ["https://github.com/omhq/settra"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Settra",
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Settra",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: DESCRIPTION,
      license: "https://www.apache.org/licenses/LICENSE-2.0",
      codeRepository: "https://github.com/omhq/settra",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
