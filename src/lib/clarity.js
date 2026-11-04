// Microsoft Clarity (project z7zhs5nbz5, Strict masking set in Clarity).
// Loaded only on public pages, after the page has finished loading, once per page.
// Never on the staff inbox (/enquiries), the growth tool and report reader
// (/growth-development), the vaccine planner and reminder sign-up (/vaccination-guide)
// or the contact form (/contact), which can carry a child's health details.
// If Clarity is already running and the visitor
// moves into an excluded page inside the app, we stop it and do a full page load,
// so nothing on that page is recorded.

const ID = "z7zhs5nbz5";
const EXCLUDED = [/^\/enquiries(\/|$)/, /^\/growth-development(\/|$)/, /^\/vaccination-guide(\/|$)/, /^\/contact(\/|$)/];

export const clarityExcluded = (path) => EXCLUDED.some((re) => re.test(path || "/"));

let queued = false;
let injected = false;

function inject() {
  if (injected || clarityExcluded(window.location.pathname)) return;
  injected = true;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", ID);
}

export function syncClarity(pathname) {
  if (typeof window === "undefined") return;
  try {
    if (clarityExcluded(pathname)) {
      if (injected) {
        try { if (typeof window.clarity === "function") window.clarity("stop"); } catch { /* ignore */ }
        window.location.replace(window.location.href);
      }
      return;
    }
    if (injected) return;
    if (document.readyState === "complete") inject();
    else if (!queued) {
      queued = true;
      window.addEventListener("load", inject, { once: true });
    }
  } catch { /* analytics must never break the page */ }
}
