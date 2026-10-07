import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://www.settra.io";
const GOOGLE_TAG_ID = "G-6JDD6KVW4W";
const TITLE = "Settra: Turn AI Answers into Reusable Data Artifacts";
const DESCRIPTION =
  "Turn AI answers into reusable data artifacts your team can rerun, share, and build on as the data changes.";

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
  keywords: [
    "reusable data artifacts",
    "AI data artifacts",
    "AI business answers",
    "repeatable data analysis",
    "AI reporting",
    "self-service analytics",
  ],
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
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Settra",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-data-artifacts.png",
        width: 1200,
        height: 630,
        alt: "Settra — reusable data artifacts from AI answers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-data-artifacts.png"],
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
      logo: `${SITE_URL}/favicon.svg`,
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
      applicationSubCategory: "Data analysis and reporting",
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
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_TAG_ID}');
            `,
          }}
        />
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
