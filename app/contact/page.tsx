import type { Metadata } from "next";
import { LegalPage } from "../components/legal-page";
import { TallyContactForm } from "../components/tally-contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Settra about the spreadsheet report you want to make reusable.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    siteName: "Settra",
    title: "Contact Settra",
    description:
      "Tell Settra about the spreadsheet report you want to make reusable.",
    images: [
      {
        url: "/og-data-artifacts.png",
        width: 1200,
        height: 630,
        alt: "Settra - save the method behind your reports",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Settra",
    description:
      "Tell Settra about the spreadsheet report you want to make reusable.",
    images: ["/og-data-artifacts.png"],
  },
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact Settra"
      description="Tell Settra about the spreadsheet report you want to make reusable."
      dateLabel={null}
      hideTitle
      mainClassName="contact-main"
      documentClassName="contact-document"
    >
      <section className="contact-form-section" aria-label="Contact form">
        <TallyContactForm />
      </section>
    </LegalPage>
  );
}
