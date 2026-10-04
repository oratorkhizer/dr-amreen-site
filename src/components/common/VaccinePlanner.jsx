import React, { useMemo, useState } from "react";
import {
  planFor,
  parseDob,
  formatDate,
  SCHEDULE_SOURCE,
} from "../../data/vaccines";
import {
  BOOKING_URL,
  CLINIC,
  DOCTOR,
  SUPABASE,
  VACCINE_REMINDERS_ENABLED,
} from "../../data/site";
import "../../styles/Planner.css";

/*
  "Your child's vaccine dates"

  Date of birth in, every due date out, worked out in the browser from
  src/data/vaccines.js (the IAP 2023 schedule). Nothing is sent anywhere
  unless the parent chooses WhatsApp reminders and ticks consent.

  Two ways to be reminded:
    1. Add to my calendar: an .ics file with every remaining visit and an
       alert the evening before. Works on any phone, stores nothing with us.
    2. WhatsApp reminders: parent name, WhatsApp number, child's first name
       and date of birth go to public.amreen_vaccine_reminders (insert only).
       The clinic team sees who is due on /enquiries.
*/

const DAY = 86400000;

function today() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

function icsDate(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function icsEscape(text) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function buildIcs(items, childLabel) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//babydocamreen.com//Vaccine dates//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  items.forEach((item, index) => {
    const end = new Date(item.date.getTime() + DAY);
    const description = [
      `Vaccines due (${item.age}): ${item.vaccines.join("; ")}.`,
      item.note || "",
      `Bring the vaccination card. ${DOCTOR.name}, ${CLINIC.name}, ${CLINIC.addressLine1}, ${CLINIC.addressLine2}, ${CLINIC.city}. Book: ${BOOKING_URL}`,
      "Your child's exact plan is confirmed at the clinic.",
    ]
      .filter(Boolean)
      .join("\n");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${icsDate(item.date)}-${item.key}-${index}@babydocamreen.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(item.date)}`,
      `DTEND;VALUE=DATE:${icsDate(end)}`,
      `SUMMARY:${icsEscape(`${childLabel} vaccines due (${item.age})`)}`,
      `DESCRIPTION:${icsEscape(description)}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${icsEscape(`${childLabel} vaccines due tomorrow`)}`,
      "TRIGGER:-PT6H",
      "END:VALARM",
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  // RFC 5545: fold any line longer than 75 characters.
  return lines
    .map((line) => {
      const parts = [];
      let rest = line;
      while (rest.length > 74) {
        parts.push(rest.slice(0, 74));
        rest = ` ${rest.slice(74)}`;
      }
      parts.push(rest);
      return parts.join("\r\n");
    })
    .join("\r\n");
}

function normaliseWhatsApp(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("0") && d.length === 11) d = d.slice(1);
  if (d.length === 10) d = `91${d}`;
  return /^91[6-9]\d{9}$/.test(d) ? d : null;
}

export default function VaccinePlanner() {
  const [dobText, setDobText] = useState("");
  const [childName, setChildName] = useState("");
  const [parentName, setParentName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [sendState, setSendState] = useState("idle");
  const [showAll, setShowAll] = useState(false);

  const now = today();
  const maxDob = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

  const plan = useMemo(() => {
    const dob = parseDob(dobText);
    if (!dob) return null;
    if (dob > now) return { error: "That date is in the future. Please check the date of birth." };
    if (now - dob > 18.2 * 365.25 * DAY) {
      return { error: "This planner covers children up to 18 years." };
    }
    const items = planFor(dob);
    // A visit stays "due now" for 4 weeks after its date; earlier ones are past.
    const past = items.filter((i) => i.date < new Date(now.getTime() - 28 * DAY));
    const current = items.filter((i) => !past.includes(i));
    return { dob, items, past, current, next: current[0] || null };
  }, [dobText]); // eslint-disable-line react-hooks/exhaustive-deps


  const downloadCalendar = () => {
    if (!plan || !plan.current.length) return;
    const ics = buildIcs(plan.current, childName.trim() || "Baby");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `vaccine-dates${childName.trim() ? `-${childName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : ""}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const signUp = async (event) => {
    event.preventDefault();
    if (honeypot) {
      setSendState("done");
      return;
    }
    const number = normaliseWhatsApp(whatsapp);
    if (!number) {
      setSendState("bad_phone");
      return;
    }
    if (!consent || parentName.trim().length < 2 || !plan || !plan.dob) {
      setSendState("missing");
      return;
    }
    setSendState("sending");
    try {
      const response = await fetch(`${SUPABASE.url}/rest/v1/amreen_vaccine_reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE.anonKey,
          Authorization: `Bearer ${SUPABASE.anonKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          parent_name: parentName.trim().slice(0, 80),
          whatsapp: number,
          child_name: childName.trim() ? childName.trim().slice(0, 60) : null,
          child_dob: dobText,
          consent: true,
          source_path: "/vaccination-guide",
        }),
      });
      if (response.ok || response.status === 409) {
        setSendState("done");
        if (window.va) window.va("event", { name: "vaccine_reminder_signup" });
      } else {
        setSendState("error");
      }
    } catch {
      setSendState("error");
    }
  };

  const listed = plan && !plan.error ? (showAll ? plan.items : plan.current) : [];

  return (
    <section className="planner" id="vaccine-dates" aria-labelledby="planner-heading">
      <h2 className="planner-heading" id="planner-heading">
        Your child's vaccine dates
      </h2>
      <p className="planner-intro">
        Enter the date of birth and see the exact date of every visit, from the
        IAP 2023 schedule. Add them all to your phone's calendar in one tap
        {VACCINE_REMINDERS_ENABLED ? ", or ask us to remind you on WhatsApp" : ""}.
        Worked out on your phone; nothing is sent unless you choose reminders.
      </p>

      <div className="planner-form">
        <label>
          Child's date of birth
          <input
            type="date"
            value={dobText}
            max={maxDob}
            onChange={(event) => {
              setDobText(event.target.value);
              setSendState("idle");
            }}
          />
        </label>
        <label>
          Child's first name <small>(optional)</small>
          <input
            type="text"
            value={childName}
            maxLength={40}
            autoComplete="off"
            onChange={(event) => setChildName(event.target.value)}
          />
        </label>
      </div>

      {plan && plan.error && <p className="planner-error">{plan.error}</p>}

      {plan && !plan.error && (
        <div className="planner-result" aria-live="polite">
          {plan.next ? (
            <div className="planner-next">
              <span className="planner-next-label">Next due</span>
              <strong className="planner-next-date">{formatDate(plan.next.date)}</strong>
              <span className="planner-next-age">{plan.next.age}</span>
              <p className="planner-next-vaccines">{plan.next.vaccines.join(" · ")}</p>
              <div className="planner-actions">
                <a
                  className="planner-button"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book this visit <span aria-hidden="true">↗</span>
                </a>
                <button type="button" className="planner-button planner-button-quiet" onClick={downloadCalendar}>
                  Add all {plan.current.length} dates to my calendar
                </button>
              </div>
            </div>
          ) : (
            <p className="planner-note">
              Every visit on the schedule is now in the past. Bring the card to
              your next visit and we will check nothing was missed.
            </p>
          )}

          {plan.past.length > 0 && (
            <p className="planner-past">
              {plan.past.length} earlier {plan.past.length === 1 ? "visit was" : "visits were"} due
              before today. Check each one is signed on the vaccination card. If
              any were missed, bring the card: almost every schedule can be caught up
              without starting again.
            </p>
          )}

          <ol className="planner-list">
            {listed.map((item) => (
              <li
                key={item.key}
                className={`planner-item${plan.past.includes(item) ? " is-past" : ""}${
                  plan.next && item.key === plan.next.key ? " is-next" : ""
                }`}
              >
                <div className="planner-item-when">
                  <strong>{formatDate(item.date)}</strong>
                  <span>{item.age}</span>
                </div>
                <div className="planner-item-what">
                  <ul>
                    {item.vaccines.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                  {item.note && <p>{item.note}</p>}
                </div>
              </li>
            ))}
          </ol>

          {plan.past.length > 0 && (
            <button type="button" className="planner-toggle" onClick={() => setShowAll((v) => !v)}>
              {showAll ? "Hide past visits" : `Show the ${plan.past.length} past visits too`}
            </button>
          )}

          {VACCINE_REMINDERS_ENABLED && plan.next && (
            <form className="planner-remind" onSubmit={signUp}>
              <h3>Remind me on WhatsApp</h3>
              <p>
                The clinic will message you a few days before each visit for{" "}
                {childName.trim() || "your child"}. Reply STOP at any time.
              </p>

              {sendState === "done" ? (
                <p className="planner-done" role="status">
                  Done. We will message {normaliseWhatsApp(whatsapp) ? `+${normaliseWhatsApp(whatsapp)}` : "you"} before{" "}
                  {formatDate(plan.next.date)}. You can also add the dates to your calendar above.
                </p>
              ) : (
                <>
                  <div className="planner-form">
                    <label>
                      Your name
                      <input
                        type="text"
                        value={parentName}
                        maxLength={80}
                        autoComplete="name"
                        required
                        onChange={(event) => setParentName(event.target.value)}
                      />
                    </label>
                    <label>
                      WhatsApp number
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={whatsapp}
                        autoComplete="tel"
                        placeholder="10 digit mobile"
                        required
                        onChange={(event) => setWhatsapp(event.target.value)}
                      />
                    </label>
                  </div>
                  <input
                    className="planner-trap"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    name="website"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
                  <label className="planner-consent">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      required
                    />
                    <span>
                      I agree that {CLINIC.name} may keep my name, WhatsApp number
                      and my child's first name and date of birth, only to send
                      vaccine reminders. I can ask for them to be deleted at any time.
                    </span>
                  </label>
                  <button type="submit" className="planner-button" disabled={sendState === "sending"}>
                    {sendState === "sending" ? "Saving…" : "Send me reminders"}
                  </button>
                  {sendState === "bad_phone" && (
                    <p className="planner-error">Please enter a 10 digit Indian mobile number.</p>
                  )}
                  {sendState === "missing" && (
                    <p className="planner-error">Please add your name and tick the consent box.</p>
                  )}
                  {sendState === "error" && (
                    <p className="planner-error">
                      That did not go through. Please try again, or call {CLINIC.phone}.
                    </p>
                  )}
                </>
              )}
            </form>
          )}

          <p className="planner-note">
            Dates follow the {SCHEDULE_SOURCE}. Vaccine brands differ and some
            combine doses, so your child's exact plan is confirmed at the clinic.
            A premature baby follows the same dates, counted from the actual date of birth.
          </p>
        </div>
      )}
    </section>
  );
}
