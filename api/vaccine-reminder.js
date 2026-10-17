// Vaccine planner WhatsApp reminder sign-up. Runs the bot checks, then inserts
// into public.amreen_vaccine_reminders with the public anon key.
import { SUPABASE } from "../src/data/site.js";
import { HUMAN_CHECK_FAILED, clientIp, isBot, readBody, verifyTurnstile } from "./_protect.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const b = await readBody(req);
  if (isBot(b, { name: b.parent_name })) return res.status(200).json({ ok: true });
  if (!(await verifyTurnstile(b.turnstile, clientIp(req)))) {
    return res.status(400).json({ error: HUMAN_CHECK_FAILED });
  }
  const s = (v, max) => String(v || "").trim().slice(0, max);
  const row = {
    parent_name: s(b.parent_name, 80),
    whatsapp: s(b.whatsapp, 15),
    child_name: s(b.child_name, 60) || null,
    child_dob: s(b.child_dob, 10),
    consent: b.consent === true,
    source_path: s(b.source_path, 80) || "/vaccination-guide",
  };
  if (!/^91[6-9]\d{9}$/.test(row.whatsapp) || row.parent_name.length < 2 || !row.consent || !row.child_dob) {
    return res.status(400).json({ error: "Please check the details and try again." });
  }
  try {
    const r = await fetch(`${SUPABASE.url}/rest/v1/amreen_vaccine_reminders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE.anonKey,
        Authorization: `Bearer ${SUPABASE.anonKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (r.ok || r.status === 409) return res.status(200).json({ ok: true });
    return res.status(502).json({ error: "Could not save the reminder." });
  } catch {
    return res.status(502).json({ error: "Could not save the reminder." });
  }
}
