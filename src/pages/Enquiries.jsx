import React, { useState } from "react";
import { SUPABASE } from "../data/site";
import "../styles/Enquiries.css";
import RemindersDesk from "../components/common/RemindersDesk";

// Private inbox for the clinic team. Reads through a SECURITY DEFINER
// function that checks the passcode, so the anon key alone cannot read
// any enquiry. Excluded from the sitemap and from robots.txt.

const Enquiries = () => {
  const [passcode, setPasscode] = useState("");
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState("idle");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("enquiries");
  const [reminders, setReminders] = useState([]);

  const loadReminders = async (code) => {
    try {
      const response = await fetch(
        `${SUPABASE.url}/rest/v1/rpc/amreen_reminders_list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE.anonKey,
            Authorization: `Bearer ${SUPABASE.anonKey}`,
          },
          body: JSON.stringify({ passcode: code }),
        }
      );
      const data = await response.json();
      if (data && data.ok) setReminders(data.rows || []);
    } catch {
      // the enquiries tab still works if this fails
    }
  };

  const load = async (event) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(
        `${SUPABASE.url}/rest/v1/rpc/${SUPABASE.listFunction}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE.anonKey,
            Authorization: `Bearer ${SUPABASE.anonKey}`,
          },
          body: JSON.stringify({ passcode }),
        }
      );

      const data = await response.json();

      if (!data || data.ok !== true) {
        setStatus("denied");
        return;
      }

      setRows(data.rows || []);
      await loadReminders(passcode);
      setStatus("ready");
    } catch (error) {
      setStatus("denied");
    }
  };

  const visible = (rows || []).filter((row) => {
    if (!search.trim()) return true;
    const needle = search.toLowerCase();
    return [row.name, row.phone, row.email, row.subject, row.message]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(needle));
  });

  const downloadCsv = () => {
    const header = ["ref", "created_at", "name", "phone", "email", "subject", "message"];
    const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [
      header.join(","),
      ...visible.map((row) => header.map((key) => escape(row[key])).join(",")),
    ].join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `dramreen-enquiries-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="enquiries-page" id="main-content">
      <div className="enquiries-container">
        <h1 className="enquiries-title">
          {tab === "reminders" ? "Vaccine reminders" : "Enquiries inbox"}
        </h1>

        {status === "ready" && (
          <div className="enquiries-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === "enquiries"} className={tab === "enquiries" ? "is-active" : ""} onClick={() => setTab("enquiries")}>
              Enquiries ({rows.length})
            </button>
            <button type="button" role="tab" aria-selected={tab === "reminders"} className={tab === "reminders" ? "is-active" : ""} onClick={() => setTab("reminders")}>
              Vaccine reminders ({reminders.length})
            </button>
          </div>
        )}

        {status !== "ready" ? (
          <form className="enquiries-gate" onSubmit={load}>
            <label htmlFor="enquiries-passcode">Passcode</label>

            <input
              id="enquiries-passcode"
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              autoComplete="current-password"
              required
            />

            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Checking…" : "Open inbox"}
            </button>

            {status === "denied" && (
              <p className="enquiries-error" role="alert">
                That passcode did not work.
              </p>
            )}
          </form>
        ) : tab === "reminders" ? (
          <RemindersDesk passcode={passcode} rows={reminders} onChange={() => loadReminders(passcode)} />
        ) : (
          <>
            <div className="enquiries-toolbar">
              <input
                type="search"
                placeholder="Search name, mobile or message"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search enquiries"
              />

              <span className="enquiries-count">
                {visible.length} of {rows.length}
              </span>

              <button type="button" onClick={downloadCsv}>
                Download CSV
              </button>
            </div>

            {visible.length === 0 && (
              <p className="enquiries-empty">No enquiries yet.</p>
            )}

            <ul className="enquiries-list">
              {visible.map((row) => (
                <li className="enquiries-item" key={row.id}>
                  <div className="enquiries-item-head">
                    <strong>{row.name}</strong>
                    <a href={`tel:${row.phone}`}>{row.phone}</a>
                    <span className="enquiries-tag">{row.subject}</span>
                    <time dateTime={row.created_at}>
                      {new Date(row.created_at).toLocaleString("en-IN")}
                    </time>
                  </div>

                  {row.email && (
                    <a className="enquiries-email" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  )}

                  <p className="enquiries-message">{row.message}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
};

export default Enquiries;
