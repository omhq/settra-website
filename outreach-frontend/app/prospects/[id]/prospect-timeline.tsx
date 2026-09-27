"use client";

import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const API_URL = (
  process.env.NEXT_PUBLIC_OUTREACH_API_URL ?? "http://localhost:8001"
).replace(/\/$/, "");

type Stage =
  | "researching"
  | "connection_sent"
  | "connected"
  | "conversation"
  | "meeting"
  | "qualified"
  | "nurture"
  | "not_a_fit";

type ActivityType =
  | "research"
  | "cold_email"
  | "follow_up_email"
  | "linkedin_connection_request"
  | "linkedin_message"
  | "linkedin_comment"
  | "phone_call"
  | "voicemail"
  | "meeting"
  | "email_reply"
  | "linkedin_reply"
  | "post_reply"
  | "call_back"
  | "note"
  | "stage_change"
  | "connection_request"
  | "message"
  | "follow_up"
  | "reply";

type Direction = "outbound" | "inbound" | "mutual" | "internal";

type ActivityInfo = {
  label: string;
  direction: Direction;
  actor: string;
};

const activityGroups: {
  label: string;
  options: { value: ActivityType; label: string }[];
}[] = [
  {
    label: "Your outreach",
    options: [
      { value: "cold_email", label: "Cold email" },
      { value: "follow_up_email", label: "Follow-up email" },
      {
        value: "linkedin_connection_request",
        label: "LinkedIn connection request",
      },
      { value: "linkedin_message", label: "LinkedIn message" },
      { value: "linkedin_comment", label: "LinkedIn post comment" },
      { value: "phone_call", label: "Phone call" },
      { value: "voicemail", label: "Voicemail" },
    ],
  },
  {
    label: "From prospect",
    options: [
      { value: "email_reply", label: "Email reply" },
      { value: "linkedin_reply", label: "LinkedIn message reply" },
      { value: "post_reply", label: "LinkedIn post reply" },
      { value: "call_back", label: "Called back" },
    ],
  },
  {
    label: "Shared or internal",
    options: [
      { value: "meeting", label: "Meeting" },
      { value: "research", label: "Research" },
      { value: "note", label: "Internal note" },
    ],
  },
];

const activityInfo: Record<ActivityType, ActivityInfo> = {
  research: { label: "Research", direction: "internal", actor: "Internal" },
  cold_email: { label: "Cold email", direction: "outbound", actor: "You" },
  follow_up_email: {
    label: "Follow-up email",
    direction: "outbound",
    actor: "You",
  },
  linkedin_connection_request: {
    label: "LinkedIn connection request",
    direction: "outbound",
    actor: "You",
  },
  linkedin_message: {
    label: "LinkedIn message",
    direction: "outbound",
    actor: "You",
  },
  linkedin_comment: {
    label: "LinkedIn post comment",
    direction: "outbound",
    actor: "You",
  },
  phone_call: { label: "Phone call", direction: "outbound", actor: "You" },
  voicemail: { label: "Voicemail", direction: "outbound", actor: "You" },
  meeting: { label: "Meeting", direction: "mutual", actor: "You + prospect" },
  email_reply: {
    label: "Email reply",
    direction: "inbound",
    actor: "Prospect",
  },
  linkedin_reply: {
    label: "LinkedIn message reply",
    direction: "inbound",
    actor: "Prospect",
  },
  post_reply: {
    label: "LinkedIn post reply",
    direction: "inbound",
    actor: "Prospect",
  },
  call_back: { label: "Called back", direction: "inbound", actor: "Prospect" },
  note: { label: "Internal note", direction: "internal", actor: "Internal" },
  stage_change: {
    label: "Stage changed",
    direction: "internal",
    actor: "System",
  },
  connection_request: {
    label: "Connection request",
    direction: "outbound",
    actor: "You",
  },
  message: { label: "Message", direction: "outbound", actor: "You" },
  follow_up: { label: "Follow-up", direction: "outbound", actor: "You" },
  reply: { label: "Reply received", direction: "inbound", actor: "Prospect" },
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
  next_action: string | null;
  next_action_reason: string | null;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

type Activity = {
  id: number;
  contact_id: number;
  activity_type: ActivityType;
  body: string;
  occurred_at: string;
  created_at: string;
};

type Detail = { contact: Contact; activities: Activity[] };

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

function localDateTimeValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function getActivityInfo(type: ActivityType): ActivityInfo {
  return (
    activityInfo[type] ?? {
      label: type,
      direction: "internal",
      actor: "Internal",
    }
  );
}

const directionStyles: Record<
  Direction,
  { card: string; badge: string; dot: string; glyph: string }
> = {
  outbound: {
    card: "border-blue-400/25 bg-blue-500/[0.07]",
    badge: "bg-blue-400/15 text-blue-200",
    dot: "border-blue-300/40 bg-blue-500 text-white",
    glyph: "↗",
  },
  inbound: {
    card: "border-emerald-400/25 bg-emerald-500/[0.07]",
    badge: "bg-emerald-400/15 text-emerald-200",
    dot: "border-emerald-300/40 bg-emerald-500 text-white",
    glyph: "↙",
  },
  mutual: {
    card: "border-violet-400/25 bg-violet-500/[0.07]",
    badge: "bg-violet-400/15 text-violet-200",
    dot: "border-violet-300/40 bg-violet-500 text-white",
    glyph: "↔",
  },
  internal: {
    card: "border-white/10 bg-slate-900/80",
    badge: "bg-white/10 text-slate-300",
    dot: "border-white/15 bg-slate-700 text-white",
    glyph: "•",
  },
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400";

export function ProspectTimeline({ contactId }: { contactId: number }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>("cold_email");
  const [activityBody, setActivityBody] = useState("");
  const [occurredAt, setOccurredAt] = useState(localDateTimeValue);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const loadDetail = useCallback(async () => {
    try {
      const nextDetail = await api<Detail>(`/api/contacts/${contactId}`);
      setError(null);
      setDetail(nextDetail);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not load this prospect.",
      );
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    let active = true;
    void api<Detail>(`/api/contacts/${contactId}`)
      .then((nextDetail) => {
        if (!active) return;
        setError(null);
        setDetail(nextDetail);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(
          caught instanceof Error
            ? caught.message
            : "Could not load this prospect.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [contactId]);

  const activities = useMemo(
    () =>
      [...(detail?.activities ?? [])].sort(
        (left, right) =>
          new Date(left.occurred_at).getTime() -
            new Date(right.occurred_at).getTime() || left.id - right.id,
      ),
    [detail?.activities],
  );

  async function addActivity(event: FormEvent) {
    event.preventDefault();
    if (!activityBody.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await api<Activity>("/api/activities", {
        method: "POST",
        body: JSON.stringify({
          contact_id: contactId,
          activity_type: activityType,
          body: activityBody.trim(),
          occurred_at: occurredAt ? new Date(occurredAt).toISOString() : null,
        }),
      });
      setActivityBody("");
      setOccurredAt(localDateTimeValue());
      setComposerOpen(false);
      await loadDetail();
      requestAnimationFrame(() =>
        addButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      );
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not save this event.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-sm text-slate-400">
        Loading prospect…
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-slate-100">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Prospect not found</h1>
          <p className="mt-2 text-sm text-slate-400">
            {error ?? "This prospect may have been removed."}
          </p>
          <Link
            className="mt-5 inline-block text-sm text-blue-300 hover:text-blue-200"
            href="/"
          >
            ← Back to pipeline
          </Link>
        </div>
      </main>
    );
  }

  const { contact } = detail;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-10">
        <Link
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          href="/"
        >
          <span aria-hidden="true">←</span> Pipeline
        </Link>

        <header className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">
          <div className="p-6 sm:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  {contact.full_name}
                </h1>
                <span className="rounded-full bg-blue-400/15 px-3 py-1 text-xs font-medium text-blue-200">
                  {stageNames[contact.stage]}
                </span>
              </div>
              <p className="mt-2 text-base text-slate-400">
                {[contact.title, contact.company].filter(Boolean).join(" · ") ||
                  "Role and company not set"}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {contact.linkedin_url && (
                  <a
                    className="text-blue-300 hover:text-blue-200"
                    href={contact.linkedin_url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    LinkedIn ↗
                  </a>
                )}
                {contact.email && (
                  <a
                    className="text-blue-300 hover:text-blue-200"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>
                )}
                <span className="text-slate-500">
                  Owner: {contact.owner || "Unassigned"}
                </span>
                <span className="capitalize text-slate-500">
                  {contact.priority} priority
                </span>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mt-5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        <section className="mt-6 grid gap-4 rounded-2xl border border-blue-300/20 bg-blue-400/[0.05] p-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
            Observed signal
          </p>
          <div>
            <h2 className="font-semibold leading-6 text-white">
              {contact.signal_summary ||
                "No observed signal has been recorded yet."}
            </h2>
          </div>
        </section>

        <section className="mt-6 grid gap-4 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-200">
            Next best action
          </p>
          <div>
            <h2 className="font-semibold text-white">
              {contact.next_action || "Ready for AI review"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              {contact.next_action_reason ||
                "Add the latest events, then ask Codex to review this prospect. The pipeline stage and follow-up plan will be updated from that review."}
            </p>
            {contact.next_action && (
              <p className="mt-3 text-sm font-medium text-amber-100">
                {contact.next_follow_up
                  ? `Follow up on ${formatDate(contact.next_follow_up)}.`
                  : "No follow-up date is needed right now."}
              </p>
            )}
            {contact.last_reviewed_at && (
              <p className="mt-3 text-xs text-slate-600">
                Reviewed {formatDateTime(contact.last_reviewed_at)}
              </p>
            )}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-4xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Activity
              </p>
            </div>
          </div>

          <ol className="relative space-y-5 before:absolute before:bottom-8 before:left-5 before:top-5 before:w-px before:bg-white/10">
            {activities.map((activity) => {
              const info = getActivityInfo(activity.activity_type);
              const style = directionStyles[info.direction];
              return (
                <li className="relative pl-14" key={activity.id}>
                  <span
                    className={`absolute left-0 top-5 grid size-10 place-items-center rounded-full border text-base font-semibold shadow-lg ${style.dot}`}
                  >
                    {style.glyph}
                  </span>
                  <article
                    className={`rounded-2xl border p-5 shadow-xl shadow-black/10 ${style.card}`}
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {info.label}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${style.badge}`}
                        >
                          {info.actor}
                        </span>
                      </div>
                      <time
                        className="shrink-0 text-xs text-slate-500"
                        dateTime={activity.occurred_at}
                      >
                        {formatDateTime(activity.occurred_at)}
                      </time>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                      {activity.body || "No details recorded."}
                    </p>
                  </article>
                </li>
              );
            })}

            <li className="relative pl-14">
              <button
                ref={addButtonRef}
                aria-expanded={composerOpen}
                aria-label="Add timeline event"
                className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border border-blue-300/40 bg-blue-500 text-2xl font-light text-white shadow-lg shadow-blue-950/40 transition hover:scale-105 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                type="button"
                onClick={() => setComposerOpen((open) => !open)}
              >
                {composerOpen ? "×" : "+"}
              </button>

              {composerOpen ? (
                <form
                  className="rounded-2xl border border-blue-400/25 bg-slate-900 p-5 shadow-2xl shadow-black/20"
                  onSubmit={addActivity}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">
                        Add timeline event
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Record exactly what happened, including useful context.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="mb-1.5 block text-xs font-medium text-slate-400">
                        Event type
                      </span>
                      <select
                        className={inputClass}
                        value={activityType}
                        onChange={(event) =>
                          setActivityType(event.target.value as ActivityType)
                        }
                      >
                        {activityGroups.map((group) => (
                          <optgroup key={group.label} label={group.label}>
                            {group.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="mb-1.5 block text-xs font-medium text-slate-400">
                        When
                      </span>
                      <input
                        className={inputClass}
                        type="datetime-local"
                        value={occurredAt}
                        onChange={(event) => setOccurredAt(event.target.value)}
                      />
                    </label>
                  </div>
                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">
                      What happened?
                    </span>
                    <textarea
                      autoFocus
                      className={inputClass}
                      placeholder="Paste the message, summarize the reply, or capture the useful detail…"
                      required
                      rows={5}
                      value={activityBody}
                      onChange={(event) => setActivityBody(event.target.value)}
                    />
                  </label>
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      className="rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
                      type="button"
                      onClick={() => setComposerOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-50"
                      disabled={saving || !activityBody.trim()}
                      type="submit"
                    >
                      {saving ? "Saving…" : "Add event"}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="pt-2 text-left text-sm text-slate-500 transition hover:text-blue-300"
                  type="button"
                  onClick={() => setComposerOpen(true)}
                >
                  Add an event
                </button>
              )}
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
