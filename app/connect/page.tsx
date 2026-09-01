import type { Metadata } from "next";
import { LegalPage } from "../components/legal-page";

const APP_URL = "https://app.settra.io";
const MCP_URL = `${APP_URL}/mcp`;
const CLAUDE_INSTALL_URL =
  "https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Settra&connectorUrl=https%3A%2F%2Fapp.settra.io%2Fmcp";

export const metadata: Metadata = {
  title: "Connect Settra",
  description:
    "Connect Settra to Claude, ChatGPT, Codex, or another MCP client.",
  alternates: { canonical: "/connect" },
  openGraph: {
    type: "website",
    url: "/connect",
    siteName: "Settra",
    title: "Connect Settra to your AI assistant",
    description:
      "Authorize your Settra workspace in Claude, ChatGPT, Codex, or another MCP client.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Settra" }],
  },
};

export default function ConnectPage() {
  return (
    <LegalPage
      title="Connect Settra"
      description="Authorize your Settra workspace in Claude, ChatGPT, Codex, or another MCP client."
      dateLabel={null}
    >
      <section>
        <h2>Before you connect</h2>
        <ol>
          <li>
            Create a Settra account and connect the Google Drive spreadsheet or
            tabular file you want to use.
          </li>
          <li>Wait for its first sync to finish successfully.</li>
          <li>
            Use the global MCP endpoint below. You will choose the Settra
            workspace to grant during OAuth.
          </li>
        </ol>
        <code className="document-code">{MCP_URL}</code>
      </section>

      <section>
        <h2>Claude</h2>
        <p>
          The button opens Claude&apos;s official custom-connector form with the
          Settra name and MCP endpoint prefilled. Review the values, confirm the
          connector, then sign in to Settra and choose a workspace.
        </p>
        <div className="document-actions">
          <a className="button" href={CLAUDE_INSTALL_URL}>
            Add Settra to Claude <span aria-hidden="true">→</span>
          </a>
          <a
            className="button button-outline"
            href="https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp"
            target="_blank"
            rel="noreferrer"
          >
            Claude instructions
          </a>
        </div>
        <p>
          On Team and Enterprise plans, a workspace owner may need to add the
          connector before members can connect their individual Settra accounts.
        </p>
      </section>

      <section>
        <h2>ChatGPT</h2>
        <p>
          Until Settra has a public ChatGPT directory listing, a workspace admin
          or an account with developer-mode access must add it as a custom app.
          Availability and permitted actions depend on your ChatGPT plan and
          workspace settings.
        </p>
        <ol>
          <li>Enable developer mode in ChatGPT&apos;s Apps settings.</li>
          <li>
            Choose <strong>Create app</strong>, enter <strong>Settra</strong> as
            the name, and paste the MCP endpoint shown above.
          </li>
          <li>
            Choose OAuth, scan the tools, sign in to Settra, and select the
            workspace to grant.
          </li>
          <li>Create the app, then enable it in a new chat.</li>
        </ol>
        <div className="document-actions">
          <a className="button" href={`${APP_URL}/settings`}>
            Open Settra settings <span aria-hidden="true">→</span>
          </a>
          <a
            className="button button-outline"
            href="https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt"
            target="_blank"
            rel="noreferrer"
          >
            ChatGPT instructions
          </a>
        </div>
      </section>

      <section>
        <h2>Verify the connection</h2>
        <p>Start a new conversation and try these prompts in order:</p>
        <ol>
          <li>“List the collections available in Settra.”</li>
          <li>“Open the first collection and summarize its cubes.”</li>
          <li>“Query one cube for five rows.”</li>
        </ol>
        <p>
          Settra records privacy-safe request metrics, not the contents of your
          MCP requests or responses. You can disconnect Settra from your AI
          assistant at any time.
        </p>
      </section>

      <section>
        <h2>Self-hosted Settra</h2>
        <p>
          Use the MCP server URL shown in your own deployment&apos;s Settings
          page, not the managed endpoint above. The endpoint must be public
          HTTPS for hosted assistants to reach it, and MCP OAuth must be
          enabled.
        </p>
      </section>
    </LegalPage>
  );
}
