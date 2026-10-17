// Contact page enquiry. Runs the bot checks, then inserts into
// public.amreen_enquiries with the public anon key (same as the browser did).
import { SUPABASE } from "../src/data/site.js";
import { HUMAN_CHECK_FAILED, clientIp, isBot, readBody, verifyTurnstile } from "./_protect.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const b = await readBody(req);
  if (isBot(b, { name: b.name, email: b.email })) return res.status(200).json({ ok: true });
  if (!(await verifyTurnstile(b.turnstile, clientIp(req)))) {
    return res.status(400).json({ error: HUMAN_CHECK_FAILED });
  }
  const s = (v, max) => String(v || "").trim().slice(0, max);
  const row = {
    name: s(b.name, 120),
    phone: s(b.phone, 30),
    email: s(b.email, 200) || null,
    subject: s(b.subject, 40),
    message: s(b.message, 4000),
  };
  if (!row.name || row.phone.replace(/\D/g, "").length < 10 || !row.message) {
    return res.status(400).json({ error: "Please fill in your name, mobile number and message." });
  }
  try {
    const r = await fetch(`${SUPABASE.url}/rest/v1/${SUPABASE.table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE.anonKey,
        Authorization: `Bearer ${SUPABASE.anonKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!r.ok) return res.status(502).json({ error: "Could not save the enquiry." });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Could not save the enquiry." });
  }
}
