"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

const API_URL = (
  process.env.NEXT_PUBLIC_OUTREACH_API_URL ?? "http://localhost:8001"
).replace(/\/$/, "");

const stages = [
  "researching",
  "connection_sent",
  "connected",
  "conversation",
  "meeting",
  "qualified",
  "nurture",
  "not_a_fit",
] as const;

type Stage = (typeof stages)[number];

type Contact = {
  id: number;
  full_name: string;
  title: string;
  company: string;
  linkedin_url: string;
  email: string;
  location: string;
  segment: string;
  stage: Stage;
  priority: "high" | "medium" | "low";
  owner: string;
  signal_summary: string;
  notes: string;
  next_follow_up: string | null;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

type Dashboard = {
  total_contacts: number;
  replies: number;
  by_stage: Partial<Record<Stage, number>>;
  follow_ups_due: Contact[];
};

type Playbook = {
  positioning: string;
  segments: { name: string; fit: string; buyers: string; why_now: string }[];
  signals: string[];
  avoid: string[];
  templates: { name: string; body: string }[];
};

const stageNames: Record<Stage, string> = {
  researching: "Researching",
  connection_sent: "Connection sent",
  connected: "Connected",
  conversation: "Conversation",
  meeting: "Meeting",
  qualified: "Qualified",
  nurture: "Nurture",
  not_a_fit: "Not a fit",
};

function classNames(...values: (string | false | undefined)[]) {
  return values.filter(Boolean).join(" ");
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

const blankContact = {
  full_name: "",
  title: "",
  company: "",
  linkedin_url: "",
  segment: "Operations-led teams",
  priority: "medium",
  owner: "",
  signal_summary: "",
};

export function OutreachClient() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "all">("all");
  const [view, setView] = useState<"pipeline" | "playbook">("pipeline");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(blankContact);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const query = new URLSearchParams();
    if (search.trim()) query.set("q", search.trim());
    if (stageFilter !== "all") query.set("stage", stageFilter);
    const [nextContacts, nextDashboard, nextPlaybook] = await Promise.all([
      api<Contact[]>(`/api/contacts?${query.toString()}`),
      api<Dashboard>("/api/dashboard"),
      playbook ? Promise.resolve(playbook) : api<Playbook>("/api/playbook"),
    ]);
    setContacts(nextContacts);
    setDashboard(nextDashboard);
    setPlaybook(nextPlaybook);
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        await refresh();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Could not reach the outreach API.",
        );
      } finally {
        setLoading(false);
      }
    };
    void load();
    // Deliberately load on first render only; search is applied with the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeStages = useMemo(
    () => stages.filter((stage) => (dashboard?.by_stage[stage] ?? 0) > 0),
    [dashboard],
  );

  async function applyFilters(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not refresh contacts.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function createContact(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const contact = await api<Contact>("/api/contacts", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm(blankContact);
      setShowCreate(false);
      await refresh();
      router.push(`/prospects/${contact.id}`);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not save contact.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8">
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div></div>
          <div className="flex items-center gap-2">
            <button
              className={tabClass(view === "pipeline")}
              onClick={() => setView("pipeline")}
            >
              Pipeline
            </button>
            <button
              className={tabClass(view === "playbook")}
              onClick={() => setView("playbook")}
            >
              ICP &amp; copy
            </button>
            <button
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
              onClick={() => setShowCreate(true)}
            >
              Add contact
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <strong>Can’t reach the tracker.</strong> {error}{" "}
            <span className="text-rose-200/80">
              Start the FastAPI service on port 8001, or set
              NEXT_PUBLIC_OUTREACH_API_URL.
            </span>
          </div>
        )}

        {view === "playbook" ? (
          <PlaybookPanel playbook={playbook} />
        ) : (
          <>
            <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric
                label="People tracked"
                value={dashboard?.total_contacts ?? 0}
                note="Keep batches small while learning."
              />
              <Metric
                label="Connection sent"
                value={dashboard?.by_stage.connection_sent ?? 0}
                note="Awaiting acceptance."
              />
              <Metric
                label="Meaningful replies"
                value={dashboard?.replies ?? 0}
                note="A reply is insight, not just a win."
              />
              <Metric
                label="Follow-ups due"
                value={dashboard?.follow_ups_due.length ?? 0}
                note="Only after a reasoned next step."
                tone="amber"
              />
            </section>

            {activeStages.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {activeStages.map((stage) => (
                  <span
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                    key={stage}
                  >
                    {stageNames[stage]}{" "}
                    <strong className="ml-1 text-white">
                      {dashboard?.by_stage[stage]}
                    </strong>
                  </span>
                ))}
              </div>
            )}

            <div>
              <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
                <form
                  className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row"
                  onSubmit={applyFilters}
                >
                  <input
                    className={inputClass}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search person, company, title, or signal"
                  />
                  <select
                    className={selectClass}
                    value={stageFilter}
                    onChange={(event) =>
                      setStageFilter(event.target.value as Stage | "all")
                    }
                  >
                    <option value="all">All stages</option>
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stageNames[stage]}
                      </option>
                    ))}
                  </select>
                  <button
                    className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/10"
                    type="submit"
                  >
                    Filter
                  </button>
                </form>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px] text-left text-sm">
                    <thead className="bg-white/[0.03] text-xs font-medium uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Person</th>
                        <th className="px-4 py-3">Why now</th>
                        <th className="px-4 py-3">Stage</th>
                        <th className="px-4 py-3">Next step</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {contacts.map((contact) => (
                        <tr
                          className="cursor-pointer transition hover:bg-white/[0.04] focus-within:bg-white/[0.04]"
                          key={contact.id}
                          onClick={() =>
                            router.push(`/prospects/${contact.id}`)
                          }
                        >
                          <td className="px-5 py-4">
                            <div className="font-medium text-white">
                              {contact.full_name}
                            </div>
                            <div className="mt-1 text-xs text-slate-400">
                              {[contact.title, contact.company]
                                .filter(Boolean)
                                .join(" · ") || "Add role and company"}
                            </div>
                          </td>
                          <td className="max-w-xs px-4 py-4 text-xs leading-5 text-slate-400">
                            <span className="line-clamp-2">
                              {contact.signal_summary ||
                                "No specific signal yet"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <StagePill stage={contact.stage} />
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-300">
                            {contact.last_reviewed_at && contact.next_follow_up
                              ? formatDate(contact.next_follow_up)
                              : "Pending review"}
                          </td>
                        </tr>
                      ))}
                      {!loading && contacts.length === 0 && (
                        <tr>
                          <td
                            className="px-5 py-14 text-center text-slate-400"
                            colSpan={4}
                          >
                            No contacts yet. Start with a researched batch of
                            5–10 people—not a giant list.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <form
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
            onSubmit={createContact}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Add a researched contact
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Capture the observed signal before sending anything.
                </p>
              </div>
              <button
                className="text-slate-400 hover:text-white"
                type="button"
                onClick={() => setShowCreate(false)}
              >
                ✕
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name *">
                <input
                  className={inputClass}
                  required
                  value={form.full_name}
                  onChange={(event) =>
                    setForm({ ...form, full_name: event.target.value })
                  }
                />
              </Field>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </Field>
              <Field label="Company">
                <input
                  className={inputClass}
                  value={form.company}
                  onChange={(event) =>
                    setForm({ ...form, company: event.target.value })
                  }
                />
              </Field>
              <Field label="LinkedIn profile">
                <input
                  className={inputClass}
                  type="url"
                  value={form.linkedin_url}
                  onChange={(event) =>
                    setForm({ ...form, linkedin_url: event.target.value })
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </Field>
              <Field label="ICP segment">
                <select
                  className={selectClass}
                  value={form.segment}
                  onChange={(event) =>
                    setForm({ ...form, segment: event.target.value })
                  }
                >
                  <option>Operations-led teams</option>
                  <option>Finance and revenue operations</option>
                  <option>AI-forward agencies and service firms</option>
                </select>
              </Field>
              <Field label="Owner">
                <input
                  className={inputClass}
                  value={form.owner}
                  onChange={(event) =>
                    setForm({ ...form, owner: event.target.value })
                  }
                  placeholder="Your name"
                />
              </Field>
              <Field label="Priority">
                <select
                  className={selectClass}
                  value={form.priority}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      priority: event.target.value as "high" | "medium" | "low",
                    })
                  }
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </Field>
              <Field label="Observed signal" span>
                <textarea
                  className={inputClass}
                  required
                  value={form.signal_summary}
                  onChange={(event) =>
                    setForm({ ...form, signal_summary: event.target.value })
                  }
                  placeholder="e.g. Hiring a RevOps analyst; CEO mentions weekly pipeline review in Sheets."
                  rows={3}
                />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                type="button"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? "Saving…" : "Add contact"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function PlaybookPanel({ playbook }: { playbook: Playbook | null }) {
  if (!playbook)
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-slate-400">
        Loading the playbook…
      </div>
    );
  return (
    <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
      <div className="space-y-5">
        <article className="rounded-2xl border border-blue-300/15 bg-blue-400/[0.06] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
            Positioning
          </p>
          <p className="mt-3 text-xl leading-8 text-white">
            {playbook.positioning}
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">First ICP</h2>
          <div className="mt-5 space-y-5">
            {playbook.segments.map((segment) => (
              <div
                className="border-l-2 border-blue-400/60 pl-4"
                key={segment.name}
              >
                <h3 className="font-medium text-white">{segment.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {segment.fit}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  <strong>Talk to:</strong> {segment.buyers}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  <strong>Why now:</strong> {segment.why_now}
                </p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">Signals to look for</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            {playbook.signals.map((signal) => (
              <li className="flex gap-3" key={signal}>
                <span className="mt-0.5 text-blue-300">✦</span>
                {signal}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-semibold text-slate-200">Avoid</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
            {playbook.avoid.map((item) => (
              <li key={item}>— {item}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold">Copy: earn the conversation</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Replace every placeholder with a real observation. Do not automate
          messages while you are learning the market.
        </p>
        <div className="mt-5 space-y-5">
          {playbook.templates.map((template) => (
            <article
              className="rounded-xl border border-white/10 bg-slate-950/50 p-4"
              key={template.name}
            >
              <h3 className="text-sm font-semibold text-blue-200">
                {template.name}
              </h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {template.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  note,
  tone = "blue",
}: {
  label: string;
  value: number;
  note: string;
  tone?: "blue" | "amber";
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className={classNames(
          "mt-2 text-3xl font-semibold",
          tone === "amber" ? "text-amber-300" : "text-white",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-400">{note}</p>
    </article>
  );
}
function StagePill({ stage }: { stage: Stage }) {
  return (
    <span
      className={classNames(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        stage === "qualified"
          ? "bg-emerald-400/15 text-emerald-200"
          : stage === "not_a_fit"
            ? "bg-slate-500/20 text-slate-400"
            : stage === "meeting" || stage === "conversation"
              ? "bg-violet-400/15 text-violet-200"
              : "bg-blue-400/15 text-blue-200",
      )}
    >
      {stageNames[stage]}
    </span>
  );
}
function Field({
  label,
  children,
  span = false,
}: {
  label: string;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <label className={classNames("block", span && "sm:col-span-2")}>
      <span className="mb-1.5 block text-xs font-medium text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}
const inputClass =
  "w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400";
const selectClass =
  "w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-blue-400";
const tabClass = (active: boolean) =>
  classNames(
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    active
      ? "bg-white/10 text-white"
      : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
  );
