// Cloudflare Turnstile for public forms (Caspian Studio form-protection standard).
//
// TURNSTILE_SITEKEY: the Caspian Studio client site key goes here, once.
// While it is empty the widget is not rendered and forms behave as before
// (honeypot and fill time are still sent).
export const TURNSTILE_SITEKEY = "";

export const HUMAN_CHECK_FAILED =
  "We could not confirm this was sent by a person. Please refresh the page and try again.";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loader = null;

function loadTurnstile() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loader) {
    loader = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = () => resolve(window.turnstile || null);
      s.onerror = () => {
        loader = null;
        resolve(null);
      };
      document.head.appendChild(s);
    });
  }
  return loader;
}

// Mounts an invisible widget into `el` (an empty div inside the form).
export function createTurnstile(el) {
  const st = { token: "", id: null, shownAt: Date.now(), active: false, gone: false };
  if (TURNSTILE_SITEKEY && el && typeof window !== "undefined") {
    st.active = true;
    loadTurnstile().then((ts) => {
      if (!ts || st.gone) {
        st.active = false;
        return;
      }
      st.id = ts.render(el, {
        sitekey: TURNSTILE_SITEKEY,
        appearance: "interaction-only",
        callback: (t) => (st.token = t),
        "expired-callback": () => (st.token = ""),
        "error-callback": () => (st.token = ""),
      });
    });
  }
  return {
    elapsed: () => Date.now() - st.shownAt,
    async token() {
      if (!st.active) return "";
      const end = Date.now() + 8000;
      while (!st.token && Date.now() < end) await new Promise((r) => setTimeout(r, 200));
      return st.token;
    },
    reset() {
      st.token = "";
      if (st.id !== null && typeof window !== "undefined" && window.turnstile) {
        try {
          window.turnstile.reset(st.id);
        } catch {
          /* ignore */
        }
      }
    },
    destroy() {
      st.gone = true;
      if (st.id !== null && typeof window !== "undefined" && window.turnstile) {
        try {
          window.turnstile.remove(st.id);
        } catch {
          /* ignore */
        }
      }
    },
  };
}
