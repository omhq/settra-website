import type { Metadata } from "next";
import { LegalPage } from "../components/legal-page";

const SUPPORT_EMAIL = "support@outermeasure.com";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use Settra.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These Terms govern your use of the Settra website and hosted service."
    >
      <section>
        <h2>1. Accepting these Terms</h2>
        <p>
          By accessing or using Settra, you agree to these Terms and our{" "}
          <a href="/privacy">Privacy Policy</a>. If you use Settra for an
          organization, you represent that you have authority to accept these
          Terms for that organization. If you do not agree, do not use the
          service.
        </p>
      </section>

      <section>
        <h2>2. The service</h2>
        <p>
          Settra stages tabular data from sources you select and makes that data
          queryable by MCP-compatible agents and automations you authorize. The
          hosted service may include managed infrastructure, while the
          open-source software may be deployed in infrastructure you control.
        </p>
      </section>

      <section>
        <h2>3. Accounts and access</h2>
        <p>
          You must provide accurate account information, keep credentials and
          MCP access grants secure, and promptly notify us of suspected
          unauthorized use. You are responsible for activity performed through
          your account and for configuring appropriate access to your
          workspaces, sources, collections, destinations, and agents.
        </p>
      </section>

      <section>
        <h2>4. Your data</h2>
        <p>
          You retain ownership of the files, data, definitions, and other
          content you provide. You grant Settra only the limited rights needed
          to access, copy, transform, store, secure, and return that content to
          provide the features you choose.
        </p>
        <p>
          You are responsible for ensuring that you have the rights and
          permissions needed to connect, process, and disclose the data you use
          with Settra. Our handling of personal information and Google user data
          is described in the <a href="/privacy">Privacy Policy</a>.
        </p>
      </section>

      <section>
        <h2>5. Connected services and agents</h2>
        <p>
          Settra can connect with third-party services such as Google Drive and
          with AI assistants or agents you choose. Those third parties operate
          under their own terms and privacy policies. You control which sources
          and collections an agent may query and are responsible for reviewing
          the provider&apos;s data handling before connecting it.
        </p>
      </section>

      <section>
        <h2>6. Acceptable use</h2>
        <p>You may not use Settra to:</p>
        <ul>
          <li>break the law or violate another person&apos;s rights;</li>
          <li>access data without authorization or bypass access controls;</li>
          <li>
            introduce malware, disrupt the service, probe for vulnerabilities,
            or interfere with other users;
          </li>
          <li>
            resell access to the hosted service unless we have agreed in
            writing; or
          </li>
          <li>
            use Google user data for advertising, surveillance, credit
            decisions, data brokerage, or generalized model training.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Open-source and self-hosted deployments</h2>
        <p>
          Settra&apos;s open-source code is licensed separately under the Apache
          License 2.0. These Terms govern the website and hosted service, not
          your independent use of the open-source code under that license. If
          you self-host Settra, you are responsible for the deployment,
          security, backups, legal compliance, and third-party services you
          configure.
        </p>
      </section>

      <section>
        <h2>8. Fees</h2>
        <p>
          If you choose a paid offering, its price, billing period, renewal,
          taxes, and cancellation terms will be disclosed before purchase. You
          authorize the applicable charges for the plan you select.
        </p>
      </section>

      <section>
        <h2>9. Changes, availability, and beta features</h2>
        <p>
          We may improve, modify, limit, or discontinue features. We aim to keep
          Settra reliable, but the service may occasionally be unavailable for
          maintenance, security, or circumstances outside our control. Preview
          or beta features may change and may be less reliable than generally
          available features.
        </p>
      </section>

      <section>
        <h2>10. Suspension and termination</h2>
        <p>
          You may stop using Settra at any time. We may suspend or terminate
          access when reasonably necessary to prevent harm, address a security
          risk, comply with law, or respond to a material breach of these Terms.
          Where practical, we will provide notice and an opportunity to export
          or delete your data.
        </p>
      </section>

      <section>
        <h2>11. Disclaimers</h2>
        <p>
          To the maximum extent permitted by law, Settra is provided “as is” and
          “as available.” We disclaim implied warranties of merchantability,
          fitness for a particular purpose, non-infringement, and uninterrupted
          or error-free operation. Settra does not guarantee that source data or
          agent-generated results are complete, accurate, or suitable for a
          particular decision. You should review important outputs before acting
          on them.
        </p>
      </section>

      <section>
        <h2>12. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Settra and its maintainers,
          contributors, and service providers will not be liable for indirect,
          incidental, special, consequential, exemplary, or punitive damages, or
          for lost profits, revenues, data, or goodwill arising from the
          service. Any aggregate liability will not exceed the amount you paid
          for the hosted service during the 12 months before the event giving
          rise to the claim. These limits do not apply where prohibited by law.
        </p>
      </section>

      <section>
        <h2>13. Indemnity</h2>
        <p>
          To the extent permitted by law, you will defend and indemnify Settra
          and its maintainers against third-party claims arising from your data,
          your connected agents, your violation of these Terms, or your unlawful
          use of the service.
        </p>
      </section>

      <section>
        <h2>14. Changes to these Terms</h2>
        <p>
          We may update these Terms. Material changes will be posted with an
          updated effective date and, when appropriate, additional notice.
          Continued use after the change takes effect means you accept the
          updated Terms.
        </p>
      </section>

      <section>
        <h2>15. Applicable law and contact</h2>
        <p>
          Applicable law governs these Terms, and mandatory rights available to
          you under that law remain unaffected. Before starting a formal claim,
          please contact us so we can try to resolve the issue informally.
        </p>
        <p>
          Questions about these Terms:{" "}
          <a href={"mailto:" + SUPPORT_EMAIL}>{SUPPORT_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
