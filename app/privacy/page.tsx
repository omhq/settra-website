import type { Metadata } from "next";
import { LegalPage } from "../components/legal-page";

const SUPPORT_EMAIL = "support@outermeasure.com";
const GOOGLE_DATA_POLICY =
  "https://developers.google.com/terms/api-services-user-data-policy";
const GOOGLE_CONNECTIONS = "https://myaccount.google.com/connections";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Settra accesses, uses, stores, shares, and deletes personal information and Google user data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy explains how Settra handles information when you use our website, managed service, or Google Drive connection."
    >
      <section>
        <h2>1. Scope and responsibility</h2>
        <p>
          This Privacy Policy applies to the Settra website and hosted Settra
          service. If you run Settra yourself, you or the organization operating
          that deployment controls the data processed there. This policy still
          describes the product&apos;s standard behavior, but the operator of
          that deployment is responsible for its own hosting, access, retention,
          and legal obligations.
        </p>
      </section>

      <section>
        <h2>2. Information Settra handles</h2>
        <ul>
          <li>
            <strong>Account and workspace information.</strong> Name, email
            address, authentication identifiers, workspace membership, session
            information, and the settings needed to provide your account.
          </li>
          <li>
            <strong>Google account and authorization information.</strong> When
            you connect Google, Settra receives your basic Google profile, the
            permissions you granted, and an OAuth refresh token. Settra requests
            the narrow <code>drive.file</code> permission so it can access only
            files you select or open with Settra, rather than your entire Drive.
          </li>
          <li>
            <strong>Selected file data.</strong> File identifiers, names,
            metadata, and tabular content from the Google Sheets, Excel, CSV, or
            other supported files you explicitly select. Settra copies this
            content into your configured data destination so it remains ready
            for your agents to query.
          </li>
          <li>
            <strong>Settra configuration and usage.</strong> Sources,
            collections, schedules, schemas, business definitions, MCP access
            grants, and privacy-safe service metrics. Settra does not store the
            contents of MCP requests or responses in request history.
          </li>
          <li>
            <strong>Technical information.</strong> We may process IP address,
            browser and device information, essential cookies, and service logs
            needed to authenticate users, secure the service, diagnose errors,
            and prevent abuse. The website stores your light or dark theme
            preference in your browser.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <p>We use information only to:</p>
        <ul>
          <li>authenticate you and operate your workspace;</li>
          <li>connect to and refresh files you explicitly choose;</li>
          <li>stage tabular data in your configured destination;</li>
          <li>
            let the agents and automations you authorize discover and query that
            staged data through MCP;
          </li>
          <li>secure, maintain, troubleshoot, and support the service; and</li>
          <li>comply with law and enforce our Terms.</li>
        </ul>
      </section>

      <section>
        <h2>4. Google user data and Limited Use</h2>
        <div className="legal-callout">
          <p>
            Settra&apos;s use and transfer of information received from Google
            APIs adheres to the Google API Services User Data Policy, including
            the Limited Use requirements.
          </p>
        </div>
        <p>
          In particular, Google user data is used only to provide the
          user-facing file synchronization and agent-query features you choose.
          Settra does not sell Google user data, share it with data brokers, use
          it for advertising or credit decisions, use it for surveillance, or
          use it to train or improve generalized AI or machine-learning models.
        </p>
        <p>
          Humans do not read Google user data except when you give explicit
          permission for support, when access is necessary to investigate a
          security issue or abuse, when the data is aggregated and anonymized
          for permitted internal operations, or when required by law.
        </p>
        <p>
          Read the{" "}
          <a href={GOOGLE_DATA_POLICY} target="_blank" rel="noreferrer">
            Google API Services User Data Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2>5. When information is shared</h2>
        <ul>
          <li>
            <strong>At your direction.</strong> Query results are sent to the
            Codex, ChatGPT, Claude, or custom agent you connect and invoke. That
            provider&apos;s privacy and retention terms apply after it receives
            the result.
          </li>
          <li>
            <strong>Service providers.</strong> Hosting, database, security,
            communications, and support providers may process information only
            on our behalf and under appropriate confidentiality and security
            obligations.
          </li>
          <li>
            <strong>Safety and law.</strong> We may disclose information when
            reasonably necessary to protect users or the service, investigate
            abuse, or comply with applicable law.
          </li>
          <li>
            <strong>Business changes.</strong> Google user data would be
            transferred as part of a merger, acquisition, or sale of assets only
            after obtaining the explicit prior consent required by Google&apos;s
            policies.
          </li>
        </ul>
        <p>
          We do not sell or rent personal information or Google user data, and
          we do not share it with advertisers or information resellers.
        </p>
      </section>

      <section>
        <h2>6. Storage and security</h2>
        <p>
          Settra uses encrypted connections and reasonable administrative,
          technical, and organizational safeguards. Google OAuth refresh tokens
          are encrypted at rest per workspace and stored separately from the
          product database and source configuration. Workspaces isolate
          connections, staged data, access grants, and service metrics.
        </p>
        <p>
          Staged file data is stored in Settra-managed PostgreSQL or the
          PostgreSQL destination selected by the deployment operator. No system
          can guarantee absolute security, so you should grant only the access
          needed and protect your account and MCP credentials.
        </p>
      </section>

      <section>
        <h2>7. Retention, disconnection, and deletion</h2>
        <ul>
          <li>
            Disconnect Google from Settra&apos;s Connections page to delete the
            stored Google OAuth credential and stop future synchronization.
          </li>
          <li>
            You may also revoke Settra from your{" "}
            <a href={GOOGLE_CONNECTIONS} target="_blank" rel="noreferrer">
              Google Account connections
            </a>
            .
          </li>
          <li>
            Disconnecting Google or removing a source does not automatically
            delete previously staged copies. This preserves the last successful
            data until you choose to remove it.
          </li>
          <li>
            For a managed deployment, email{" "}
            <a href={"mailto:" + SUPPORT_EMAIL}>{SUPPORT_EMAIL}</a> to request
            deletion of staged data, your account, or associated service data.
            For a self-hosted deployment, contact its operator or delete the
            data from the infrastructure you control.
          </li>
        </ul>
        <p>
          We retain information only as long as needed to provide the service,
          meet legitimate security and recordkeeping needs, or comply with law.
          Residual copies may remain temporarily in protected backups until
          those backups cycle out in the ordinary course.
        </p>
      </section>

      <section>
        <h2>8. Your choices and rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct,
          export, restrict, object to, or delete personal information. Contact
          us to exercise a request. We may need to verify your identity before
          acting on it.
        </p>
      </section>

      <section>
        <h2>9. Children</h2>
        <p>
          Settra is built for business and developer use and is not directed to
          children under 18. We do not knowingly collect personal information
          from children.
        </p>
      </section>

      <section>
        <h2>10. Changes and contact</h2>
        <p>
          We may update this policy as Settra changes. If a change materially
          affects how previously authorized Google user data is used, we will
          provide notice and obtain consent when required before using that data
          for the new purpose.
        </p>
        <p>
          Questions or privacy requests:{" "}
          <a href={"mailto:" + SUPPORT_EMAIL}>{SUPPORT_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
