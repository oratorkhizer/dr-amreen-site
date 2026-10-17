/* global process */
// Shared bot checks for public form endpoints (Caspian Studio form-protection standard).
// Files in api/ that start with "_" are not deployed as functions by Vercel.
//
// Env: TURNSTILE_SECRET_KEY (Cloudflare Turnstile secret). While it is unset,
// the Turnstile check is skipped and only the honeypot, fill-time and name
// checks run, so deploying this before the secret exists changes nothing.

export const HUMAN_CHECK_FAILED =
  "We could not confirm this was sent by a person. Please refresh the page and try again.";

// Random-string names such as "XkPqLmZtRwVb": 10+ letters only, with 3 or
// more capitals after the first letter. Also gmail addresses whose local part
// has 3 or more dots (a common bot pattern).
export function looksRandom(name, email) {
  const n = String(name || "").trim();
  if (/^[A-Za-z]{10,}$/.test(n) && (n.slice(1).match(/[A-Z]/g) || []).length >= 3) return true;
  const e = String(email || "").trim().toLowerCase();
  const m = e.match(/^([^@]+)@(gmail|googlemail)\.com$/);
  if (m && (m[1].match(/\./g) || []).length >= 3) return true;
  return false;
}

// Returns true when the submission should be silently dropped (reply with
// the normal success response, write nothing).
export function isBot(body, { honeypot = "website", name, email } = {}) {
  const b = body || {};
  if (String(b[honeypot] || "").trim()) return true;
  const ms = Number(b.ms);
  if (b.ms !== undefined && b.ms !== null && b.ms !== "" && Number.isFinite(ms) && ms < 1500) return true;
  if (looksRandom(name, email)) return true;
  return false;
}

export function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || String(req.headers["x-real-ip"] || "") || "";
}

// Resolves true (allow) or false (reject with 400 and HUMAN_CHECK_FAILED).
// Fails open if Cloudflare cannot be reached within 3 seconds.
export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const params = new URLSearchParams({ secret, response: String(token) });
    if (ip) params.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    return data && data.success === true;
  } catch {
    return true;
  }
}

// Reads a JSON or form-encoded body whether or not Vercel has parsed it.
export async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let raw = typeof req.body === "string" ? req.body : "";
  if (!raw) {
    raw = await new Promise((resolve) => {
      let s = "";
      req.on("data", (c) => (s += c));
      req.on("end", () => resolve(s));
      req.on("error", () => resolve(s));
    });
  }
  try {
    return JSON.parse(raw);
  } catch {
    return Object.fromEntries(new URLSearchParams(raw));
  }
}
