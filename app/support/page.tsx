import type { Metadata } from "next";
import { LegalPage } from "../components/legal-page";

const SUPPORT_EMAIL = "support@outermeasure.com";
const GITHUB_ISSUES_URL = "https://github.com/omhq/settra/issues";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Settra accounts, data syncs, and AI connections.",
  alternates: { canonical: "/support" },
  openGraph: {
    type: "website",
    url: "/support",
    siteName: "Settra",
    title: "Settra Support",
    description:
      "Get help with Settra accounts, data syncs, and AI connections.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Settra" }],
  },
};

export default function SupportPage() {
  return (
    <LegalPage
      title="Settra Support"
      description="Help with accounts, Google Drive syncs, semantic models, and AI connections."
      dateLabel={null}
    >
      <section>
        <h2>Contact support</h2>
        <p>
          Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> for
          managed-service, account, billing, privacy, or security help. Include
          the email address on your Settra account and your workspace name.
        </p>
        <div className="legal-callout">
          <p>
            Do not email passwords, OAuth tokens, spreadsheet contents, or other
            secrets. We will ask for the minimum diagnostic detail needed.
          </p>
        </div>
      </section>

      <section>
        <h2>Connection troubleshooting</h2>
        <ol>
          <li>
            In Settra, confirm the source shows a successful sync and that its
            tables appear in a collection.
          </li>
          <li>
            In Settings, copy the global MCP server URL and reconnect the AI
            assistant. Complete OAuth again if the connection expired.
          </li>
          <li>
            Ask the assistant to list Settra collections, then check
            Settra&apos;s Requests page for the call.
          </li>
          <li>
            If it still fails, send the approximate time, assistant name,
            browser, and visible error message to support.
          </li>
        </ol>
        <p>
          The <a href="/connect">connection guide</a> has current setup steps
          for Claude and ChatGPT.
        </p>
      </section>

      <section>
        <h2>Open-source support</h2>
        <p>
          For reproducible bugs in a self-hosted deployment, open a public issue
          on GitHub. Remove credentials, private URLs, customer data, and logs
          containing sensitive information before posting.
        </p>
        <div className="document-actions">
          <a
            className="button button-outline"
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open a GitHub issue
          </a>
        </div>
      </section>

      <section>
        <h2>Privacy and deletion requests</h2>
        <p>
          Read the <a href="/privacy">Privacy Policy</a> for data handling and
          deletion details. Managed-service users can request account or staged
          data deletion by emailing support from the address associated with
          their Settra account.
        </p>
      </section>
    </LegalPage>
  );
}
