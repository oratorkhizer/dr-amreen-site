import React, { useMemo, useState } from "react";
import { planFor, formatDate, VISITS } from "../../data/vaccines";

const visitLabel = (key) =>
  key.startsWith("flu-") ? `yearly flu ${key.slice(4)}` : (VISITS.find((v) => v.key === key) || { age: key }).age;
import { BOOKING_URL, CLINIC, DOCTOR, SUPABASE } from "../../data/site";

/*
  Vaccine reminders for the clinic team, inside the passcode-gated
  /enquiries page. One row per child signed up from the planner on
  /vaccination-guide. For each child it works out the next visit from the
  same schedule file the public planner uses, and shows who needs a message.

  Sending is by hand from the clinic's WhatsApp: the green button opens
  WhatsApp with the message already typed and marks that visit as sent.
  Nothing is sent automatically.
*/

const DAY = 86400000;
const REMIND_DAYS_BEFORE = 7;
const STILL_DUE_DAYS_AFTER = 28;

function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

function nextVisit(row, today) {
  const dob = new Date(`${row.child_dob}T00:00:00`);
  const sent = row.sent || {};
  // Birth vaccines are given in hospital before discharge, so the desk
  // never chases them; reminders start with the 6 week visit.
  return planFor(dob).find(
    (item) =>
      item.key !== "birth" &&
      item.date >= new Date(today.getTime() - STILL_DUE_DAYS_AFTER * DAY) &&
      !sent[item.key.slice(0, 20)]
  );
}

function messageFor(row, visit) {
  const child = row.child_name ? `${row.child_name}'s` : "your child's";
  return [
    `Hello ${row.parent_name}, this is ${CLINIC.name}.`,
    `A reminder that ${child} ${visit.age} vaccines are due on ${formatDate(visit.date)}: ${visit.vaccines.join(", ")}.`,
    `Book a time with ${DOCTOR.name}: ${BOOKING_URL}`,
    "Please bring the vaccination card. Reply STOP if you do not want these reminders.",
  ].join("\n\n");
}

async function rpc(name, body) {
  const response = await fetch(`${SUPABASE.url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE.anonKey,
      Authorization: `Bearer ${SUPABASE.anonKey}`,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export default function RemindersDesk({ passcode, rows, onChange }) {
  const [busy, setBusy] = useState(null);
  const [filter, setFilter] = useState("due");
  const today = startOfToday();

  const enriched = useMemo(
    () =>
      rows.map((row) => {
        const visit = row.status === "active" ? nextVisit(row, today) : null;
        const daysTo = visit ? Math.round((visit.date - today) / DAY) : null;
        return { row, visit, daysTo, due: visit && daysTo <= REMIND_DAYS_BEFORE };
      }),
    [rows] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const counts = {
    due: enriched.filter((e) => e.due).length,
    later: enriched.filter((e) => e.visit && !e.due).length,
    all: enriched.length,
  };

  const shown = enriched
    .filter((e) => (filter === "due" ? e.due : filter === "later" ? e.visit && !e.due : true))
    .sort((a, b) => (a.visit && b.visit ? a.visit.date - b.visit.date : a.visit ? -1 : 1));

  const markSent = async (row, visit, openWhatsApp) => {
    if (openWhatsApp) {
      window.open(
        `https://wa.me/${row.whatsapp}?text=${encodeURIComponent(messageFor(row, visit))}`,
        "_blank",
        "noopener"
      );
    }
    setBusy(row.id);
    await rpc("amreen_reminder_update", { passcode, reminder_id: row.id, visit_key: visit.key });
    setBusy(null);
    onChange();
  };

  const setStatus = async (row, status) => {
    if (status === "stopped" && !window.confirm(`Stop reminders for ${row.parent_name}?`)) return;
    setBusy(row.id);
    await rpc("amreen_reminder_update", { passcode, reminder_id: row.id, new_status: status });
    setBusy(null);
    onChange();
  };

  const downloadCsv = () => {
    const header = ["created_at", "parent_name", "whatsapp", "child_name", "child_dob", "status", "next_visit", "next_due"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      header.join(","),
      ...enriched.map(({ row, visit }) =>
        [row.created_at, row.parent_name, row.whatsapp, row.child_name, row.child_dob, row.status, visit ? visit.age : "", visit ? formatDate(visit.date) : ""]
          .map(esc)
          .join(",")
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `vaccine-reminders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="reminders">
      <p className="reminders-help">
        Parents who asked for WhatsApp vaccine reminders. Anyone due within{" "}
        {REMIND_DAYS_BEFORE} days, or overdue by up to 4 weeks, shows under
        "Message now". Press the green button: WhatsApp opens with the message
        typed, and the visit is marked as sent.
      </p>

      <div className="enquiries-toolbar reminders-filters">
        {[
          ["due", `Message now (${counts.due})`],
          ["later", `Coming up (${counts.later})`],
          ["all", `Everyone (${counts.all})`],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={filter === key ? "is-active" : "is-quiet"}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
        <button type="button" className="is-quiet" onClick={downloadCsv}>
          Download CSV
        </button>
      </div>

      {shown.length === 0 && (
        <p className="enquiries-empty">
          {filter === "due" ? "Nobody needs a message today." : "No one here yet."}
        </p>
      )}

      <ul className="enquiries-list">
        {shown.map(({ row, visit, daysTo }) => (
          <li className={`enquiries-item reminders-item${row.status === "stopped" ? " is-stopped" : ""}`} key={row.id}>
            <div className="enquiries-item-head">
              <strong>{row.parent_name}</strong>
              <a href={`tel:+${row.whatsapp}`}>+{row.whatsapp}</a>
              <span className="enquiries-tag">
                {row.child_name || "Child"}, born {formatDate(new Date(`${row.child_dob}T00:00:00`))}
              </span>
              {row.status === "stopped" && <span className="enquiries-tag">Stopped</span>}
            </div>

            {visit ? (
              <p className="enquiries-message">
                <b>{visit.age}</b> due <b>{formatDate(visit.date)}</b>
                {daysTo < 0 ? ` (${-daysTo} days ago)` : daysTo === 0 ? " (today)" : ` (in ${daysTo} days)`}:{" "}
                {visit.vaccines.join("; ")}
              </p>
            ) : (
              row.status === "active" && <p className="enquiries-message">No more visits on the schedule.</p>
            )}

            <div className="reminders-actions">
              {visit && row.status === "active" && (
                <>
                  <button type="button" className="reminders-wa" disabled={busy === row.id} onClick={() => markSent(row, visit, true)}>
                    Send on WhatsApp
                  </button>
                  <button type="button" className="is-quiet" disabled={busy === row.id} onClick={() => markSent(row, visit, false)}>
                    Mark as sent
                  </button>
                </>
              )}
              {row.status === "active" ? (
                <button type="button" className="is-quiet" disabled={busy === row.id} onClick={() => setStatus(row, "stopped")}>
                  Stop reminders
                </button>
              ) : (
                <button type="button" className="is-quiet" disabled={busy === row.id} onClick={() => setStatus(row, "active")}>
                  Restart reminders
                </button>
              )}
            </div>

            {row.sent && Object.keys(row.sent).length > 0 && (
              <p className="reminders-sent">
                Sent before: {Object.entries(row.sent).map(([k, d]) => `${visitLabel(k)} on ${d}`).join(", ")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
