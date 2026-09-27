"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ProspectTimeline } from "./prospect-timeline";

export default function ProspectPage() {
  const params = useParams<{ id: string }>();
  const contactId = Number(params.id);

  if (!Number.isInteger(contactId) || contactId < 1) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-slate-100">
        <div className="text-center">
          <p className="text-lg font-semibold">
            This prospect link is invalid.
          </p>
          <Link
            className="mt-4 inline-block text-sm text-blue-300 hover:text-blue-200"
            href="/"
          >
            ← Back to pipeline
          </Link>
        </div>
      </main>
    );
  }

  return <ProspectTimeline contactId={contactId} />;
}
