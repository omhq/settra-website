"""A deliberately small, local-first outreach tracker for Settra.

Run with: uvicorn main:app --reload --port 8001
"""

from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = Path(os.environ.get("OUTREACH_DB_PATH", BASE_DIR / "data" / "outreach.db"))
STAGES = (
    "researching",
    "connection_sent",
    "connected",
    "conversation",
    "meeting",
    "qualified",
    "nurture",
    "not_a_fit",
)
ACTIVITY_TYPES = (
    "research",
    "cold_email",
    "follow_up_email",
    "linkedin_connection_request",
    "linkedin_message",
    "linkedin_comment",
    "phone_call",
    "voicemail",
    "meeting",
    "email_reply",
    "linkedin_reply",
    "post_reply",
    "call_back",
    "note",
    "stage_change",
    # Legacy values kept so existing activity records remain editable/readable.
    "connection_request",
    "message",
    "follow_up",
    "reply",
)


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


@contextmanager
def database():
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()


def row_dict(row: sqlite3.Row | None) -> dict | None:
    return dict(row) if row else None


def ensure_schema() -> None:
    with database() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS contacts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              full_name TEXT NOT NULL,
              title TEXT NOT NULL DEFAULT '',
              company TEXT NOT NULL DEFAULT '',
              linkedin_url TEXT NOT NULL DEFAULT '',
              email TEXT NOT NULL DEFAULT '',
              location TEXT NOT NULL DEFAULT '',
              segment TEXT NOT NULL DEFAULT 'Operations-led teams',
              stage TEXT NOT NULL DEFAULT 'researching',
              priority TEXT NOT NULL DEFAULT 'medium',
              owner TEXT NOT NULL DEFAULT '',
              signal_summary TEXT NOT NULL DEFAULT '',
              notes TEXT NOT NULL DEFAULT '',
              next_follow_up TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS activities (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
              activity_type TEXT NOT NULL,
              body TEXT NOT NULL DEFAULT '',
              occurred_at TEXT NOT NULL,
              created_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS activities_contact_occurred
              ON activities(contact_id, occurred_at DESC);
            CREATE INDEX IF NOT EXISTS contacts_stage ON contacts(stage);
            """
        )
        contact_columns = {
            row["name"] for row in connection.execute("PRAGMA table_info(contacts)").fetchall()
        }
        for column, definition in (
            ("next_action", "TEXT DEFAULT ''"),
            ("next_action_reason", "TEXT DEFAULT ''"),
            ("last_reviewed_at", "TEXT"),
        ):
            if column not in contact_columns:
                connection.execute(f"ALTER TABLE contacts ADD COLUMN {column} {definition}")


class ContactCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=160)
    title: str = Field(default="", max_length=160)
    company: str = Field(default="", max_length=160)
    linkedin_url: str = Field(default="", max_length=500)
    email: str = Field(default="", max_length=320)
    location: str = Field(default="", max_length=160)
    segment: str = Field(default="Operations-led teams", max_length=160)
    stage: Literal[
        "researching", "connection_sent", "connected", "conversation", "meeting", "qualified", "nurture", "not_a_fit"
    ] = "researching"
    priority: Literal["high", "medium", "low"] = "medium"
    owner: str = Field(default="", max_length=120)
    signal_summary: str = Field(default="", max_length=1000)
    notes: str = Field(default="", max_length=5000)
    next_follow_up: str | None = None


class ContactUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=160)
    title: str | None = Field(default=None, max_length=160)
    company: str | None = Field(default=None, max_length=160)
    linkedin_url: str | None = Field(default=None, max_length=500)
    email: str | None = Field(default=None, max_length=320)
    location: str | None = Field(default=None, max_length=160)
    segment: str | None = Field(default=None, max_length=160)
    stage: Literal[
        "researching", "connection_sent", "connected", "conversation", "meeting", "qualified", "nurture", "not_a_fit"
    ] | None = None
    priority: Literal["high", "medium", "low"] | None = None
    owner: str | None = Field(default=None, max_length=120)
    signal_summary: str | None = Field(default=None, max_length=1000)
    notes: str | None = Field(default=None, max_length=5000)
    next_follow_up: str | None = Field(default=None, max_length=40)
    next_action: str | None = Field(default=None, max_length=1000)
    next_action_reason: str | None = Field(default=None, max_length=3000)


class ActivityCreate(BaseModel):
    contact_id: int
    activity_type: Literal[
        "research",
        "cold_email",
        "follow_up_email",
        "linkedin_connection_request",
        "linkedin_message",
        "linkedin_comment",
        "phone_call",
        "voicemail",
        "meeting",
        "email_reply",
        "linkedin_reply",
        "post_reply",
        "call_back",
        "note",
        "stage_change",
        "connection_request",
        "message",
        "follow_up",
        "reply",
    ]
    body: str = Field(default="", max_length=5000)
    occurred_at: str | None = Field(default=None, max_length=40)


app = FastAPI(title="Settra Outreach", version="0.1.0")

origins = os.environ.get(
    "OUTREACH_ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://[::1]:3001,http://localhost:5173",
).split(",")
origin_regex = os.environ.get(
    "OUTREACH_ALLOWED_ORIGIN_REGEX",
    r"^https?://(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_origin_regex=origin_regex or None,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    ensure_schema()


def get_contact_or_404(contact_id: int) -> dict:
    with database() as connection:
        contact = connection.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return row_dict(contact)  # type: ignore[return-value]


@app.get("/api/health")
def health() -> dict:
    return {"ok": True, "database": str(DATABASE_PATH)}


@app.get("/api/contacts")
def list_contacts(
    q: str = "",
    stage: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[dict]:
    where: list[str] = []
    params: list[str | int] = []
    if q.strip():
        like = f"%{q.strip()}%"
        where.append("(full_name LIKE ? OR title LIKE ? OR company LIKE ? OR signal_summary LIKE ?)")
        params.extend([like, like, like, like])
    if stage and stage in STAGES:
        where.append("stage = ?")
        params.append(stage)
    statement = "SELECT * FROM contacts"
    if where:
        statement += " WHERE " + " AND ".join(where)
    statement += " ORDER BY CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, updated_at DESC LIMIT ?"
    params.append(limit)
    with database() as connection:
        rows = connection.execute(statement, params).fetchall()
    return [row_dict(row) for row in rows]  # type: ignore[list-item]


@app.post("/api/contacts", status_code=201)
def create_contact(payload: ContactCreate) -> dict:
    now = utc_now()
    fields = payload.model_dump()
    columns = list(fields) + ["created_at", "updated_at"]
    values = [*fields.values(), now, now]
    placeholders = ", ".join("?" for _ in columns)
    with database() as connection:
        cursor = connection.execute(
            f"INSERT INTO contacts ({', '.join(columns)}) VALUES ({placeholders})",
            values,
        )
        contact_id = cursor.lastrowid
        connection.execute(
            "INSERT INTO activities (contact_id, activity_type, body, occurred_at, created_at) VALUES (?, ?, ?, ?, ?)",
            (contact_id, "research", "Contact added to outreach tracker.", now, now),
        )
        contact = connection.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
    return row_dict(contact)  # type: ignore[return-value]


@app.get("/api/contacts/{contact_id}")
def get_contact(contact_id: int) -> dict:
    contact = get_contact_or_404(contact_id)
    with database() as connection:
        activities = connection.execute(
            "SELECT * FROM activities WHERE contact_id = ? ORDER BY occurred_at DESC, id DESC",
            (contact_id,),
        ).fetchall()
    return {"contact": contact, "activities": [row_dict(row) for row in activities]}


@app.patch("/api/contacts/{contact_id}")
def update_contact(contact_id: int, payload: ContactUpdate) -> dict:
    existing = get_contact_or_404(contact_id)
    changes = payload.model_dump(exclude_unset=True)
    if not changes:
        return existing
    now = utc_now()
    previous_stage = existing["stage"]
    next_stage = changes.get("stage")
    changes["updated_at"] = now
    if {"stage", "next_follow_up", "next_action", "next_action_reason"}.intersection(changes):
        changes["last_reviewed_at"] = now
    assignments = ", ".join(f"{field} = ?" for field in changes)
    with database() as connection:
        connection.execute(
            f"UPDATE contacts SET {assignments} WHERE id = ?",
            [*changes.values(), contact_id],
        )
        if next_stage and next_stage != previous_stage:
            connection.execute(
                "INSERT INTO activities (contact_id, activity_type, body, occurred_at, created_at) VALUES (?, ?, ?, ?, ?)",
                (contact_id, "stage_change", f"Stage changed from {previous_stage} to {next_stage}.", now, now),
            )
        contact = connection.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
    return row_dict(contact)  # type: ignore[return-value]


@app.post("/api/activities", status_code=201)
def create_activity(payload: ActivityCreate) -> dict:
    get_contact_or_404(payload.contact_id)
    now = utc_now()
    occurred_at = payload.occurred_at or now
    with database() as connection:
        cursor = connection.execute(
            "INSERT INTO activities (contact_id, activity_type, body, occurred_at, created_at) VALUES (?, ?, ?, ?, ?)",
            (payload.contact_id, payload.activity_type, payload.body, occurred_at, now),
        )
        connection.execute("UPDATE contacts SET updated_at = ? WHERE id = ?", (now, payload.contact_id))
        activity = connection.execute("SELECT * FROM activities WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return row_dict(activity)  # type: ignore[return-value]


@app.get("/api/activities")
def list_activities(limit: int = Query(default=100, ge=1, le=500)) -> list[dict]:
    with database() as connection:
        rows = connection.execute(
            """
            SELECT activities.*, contacts.full_name, contacts.company
            FROM activities JOIN contacts ON contacts.id = activities.contact_id
            ORDER BY activities.occurred_at DESC, activities.id DESC LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return [row_dict(row) for row in rows]  # type: ignore[list-item]


@app.get("/api/dashboard")
def dashboard() -> dict:
    with database() as connection:
        stage_rows = connection.execute(
            "SELECT stage, COUNT(*) AS total FROM contacts GROUP BY stage"
        ).fetchall()
        total = connection.execute("SELECT COUNT(*) AS total FROM contacts").fetchone()["total"]
        replies = connection.execute(
            """
            SELECT COUNT(*) AS total FROM activities
            WHERE activity_type IN ('reply', 'email_reply', 'linkedin_reply', 'post_reply', 'call_back')
            """
        ).fetchone()["total"]
        follow_ups = connection.execute(
            """
            SELECT * FROM contacts
            WHERE last_reviewed_at IS NOT NULL
              AND next_follow_up IS NOT NULL AND next_follow_up <= date('now')
              AND stage NOT IN ('qualified', 'not_a_fit')
            ORDER BY next_follow_up ASC
            """
        ).fetchall()
    return {
        "total_contacts": total,
        "replies": replies,
        "by_stage": {row["stage"]: row["total"] for row in stage_rows},
        "follow_ups_due": [row_dict(row) for row in follow_ups],
    }


@app.get("/api/playbook")
def playbook() -> dict:
    return {
        "positioning": "Settra saves the method behind a recurring spreadsheet report as an artifact, so you can run it again with fresh data from ChatGPT or Claude. We are looking for design partners to explore one real report together.",
        "segments": [
            {
                "name": "Start here: independent RevOps consultants",
                "fit": "Independent consultants and small consultancies that personally prepare recurring client reports from spreadsheets or exports.",
                "buyers": "RevOps consultant, fractional RevOps lead, or consultancy founder doing the reporting.",
                "why_now": "A recurring client deliverable is a concrete workflow to learn about. Start with ten profiles and select up to five using evidence; this audience is a hypothesis to test.",
            },
            {
                "name": "Later: operations and finance teams",
                "fit": "Operations-led companies of roughly 20–250 people, or finance and revenue operations teams, with recurring spreadsheet reports.",
                "buyers": "Operations Manager, Head of Operations, Chief of Staff, RevOps, Sales Operations, or FP&A lead.",
                "why_now": "Investigate a specific operations, pipeline, forecast, or actual-versus-plan report if the first audience is not a fit.",
            },
            {
                "name": "Later: agencies and service firms",
                "fit": "Teams that personally prepare repeated client reports from spreadsheet data.",
                "buyers": "Agency owner, Head of Delivery, or Operations Director.",
                "why_now": "Investigate what they rebuild for each reporting cycle. AI interest alone is not qualification.",
            },
        ],
        "signals": [
            "A verified current consulting role and a relevant service they personally deliver.",
            "A specific recurring reporting signal: monthly pipeline reviews, reporting retainers, or ongoing KPI reports.",
            "Spreadsheet or export-based inputs. Record unknown if this is not stated; ask rather than assume.",
            "One service, post, or work example that gives you a specific reason to speak with this person. Save its source URL.",
        ],
        "avoid": [
            "Strategy-only advisers or one-off CRM installers with no recurring reporting work.",
            "People whose current dashboards already cover the job, or trials that require unsupported data or setup.",
            "Promises about accuracy, time savings, pricing, or integrations that have not been verified. Dashboards and delivery channels remain planned until confirmed working.",
        ],
        "templates": [
            {
                "name": "Connection note",
                "body": "Hi {first_name}, I’m building Settra for recurring spreadsheet reports. I saw your work in {specific area} and would like to learn how you handle client reporting. Open to connecting?",
            },
            {
                "name": "After acceptance",
                "body": "Thanks for connecting, {first_name}. Do you personally prepare any weekly or monthly client reports from spreadsheets or exports? I’m building an early product around saving the method behind those reports and trying to understand the work better.",
            },
            {
                "name": "If they say yes",
                "body": "Which report takes the most work to prepare, and what do you have to redo each time?",
            },
            {
                "name": "Invite a conversation",
                "body": "Would you be open to a 20-minute conversation about that report? I’d like to understand how you prepare it and where the work piles up. No need to share client data; a description or anonymized example is enough.",
            },
            {
                "name": "One follow-up after 5–7 business days",
                "body": "Hi {first_name}, following up on my question about recurring client reports. Is spreadsheet-based reporting part of your work, or have I picked the wrong person to ask?",
            },
            {
                "name": "Design-partner invitation after discovering fit",
                "body": "Settra is still early, but this sounds like a useful workflow to explore together. I can help turn one report into a reusable artifact in ChatGPT or Claude. Would you be interested in testing it over two reporting cycles and giving candid feedback? We can agree the scope and setup before starting.",
            },
        ],
    }
