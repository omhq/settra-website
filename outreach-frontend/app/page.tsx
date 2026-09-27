import type { Metadata } from "next";
import { OutreachClient } from "./outreach-client";

export const metadata: Metadata = {
  title: "Outreach tracker",
  description: "Private Settra founder-led outreach tracker.",
  robots: { index: false, follow: false },
};

export default function OutreachPage() {
  return <OutreachClient />;
}
