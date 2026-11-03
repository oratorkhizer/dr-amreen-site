import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { OPD, BOOKING_URL } from "../../data/site";
import { installSigTrack, sig } from "../../lib/sigTrack";
import "../../styles/Home/HomeDoorMarks.css";

// The home page opening: height marks on a painted door frame. As the parent
// scrolls, a child's pencil marks appear one above the other and the view
// rises with them. Scroll position drives everything, so it runs backwards
// too. With reduced motion the frame and all five marks are shown still,
// with the notes listed beside them.
//
// Every line below reuses wording already on the site (vaccines.js,
// articles.js, MilestoneChecker). Do not add vaccine names or milestone ages
// that the site does not already give.

// y = where the mark sits on the photo, as a fraction of its height
// (the floor is at about .955 of the photo).
const MARKS = [
  {
    label: "Birth",
    y: 0.773,
    kicker: "At birth",
    line: "The first vaccines: BCG, oral polio and hepatitis B, dose 1. Breast milk alone is enough for the first six months.",
    to: "/vaccination-guide#vaccine-dates",
    cta: "Your child's vaccine dates",
  },
  {
    label: "6 months",
    y: 0.711,
    kicker: "6 months",
    line: "Rolls over, sits with support, reaches for objects. Time to start soft, mashed home food while breastfeeding continues.",
    to: "/child-nutrition",
    cta: "Feeding by age",
  },
  {
    label: "1 year",
    y: 0.682,
    kicker: "1 year",
    line: "Babies usually treble their birth weight by one year. Many pull to stand, and may take first steps.",
    to: "/growth-development#growth-heading",
    cta: "Is my child growing well?",
  },
  {
    label: "2 years",
    y: 0.639,
    kicker: "2 years",
    line: "Runs, kicks a ball, and joins two words together, like \"more milk\".",
    to: "/growth-development#milestones-heading",
    cta: "Milestone check",
  },
  {
    label: "5 years",
    y: 0.555,
    kicker: "5 years",
    line: "Counts to 10 and hops on one foot. The 4 to 6 year vaccine visit falls around now.",
    to: "/vaccination-guide#vaccine-dates",
    cta: "Your child's vaccine dates",
  },
];

// Scroll story, as fractions of the pinned section. Mark i is fully drawn
// and centred at AT[i].
// Nov 2026: section is 320vh (330vh on phones). Every beat, the intro and
// the closing card each stay on screen for at least 9% of the scroll.
const AT = [0.15, 0.3, 0.45, 0.6, 0.75];
const OUTRO = [0.83, 0.91];
const SEEN_KEY = "sig-seen-amreen";

function readSeen() {
  try {
    if (/[?&]replay=1(&|$)/.test(window.location.search)) return false;
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
// Keep "#after-door-marks" out of the address bar, so a reload does not
// jump past the hero (it can get there from a tap before the page is ready).
function dropSkipHash() {
  try {
    if (window.location.hash === "#after-door-marks") {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search
      );
    }
  } catch {
    /* ignore */
  }
}
function writeSeen(on) {
  try {
    if (on) window.localStorage.setItem(SEEN_KEY, "1");
    else window.localStorage.removeItem(SEEN_KEY);
  } catch {
    /* storage blocked: the moment simply plays again next time */
  }
}

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

// Which mark the camera is on (a fraction between marks while it rises).
function cameraIndex(p) {
  if (p <= AT[0]) return 0;
  for (let i = 0; i < AT.length - 1; i += 1) {
    const hold = AT[i] + 0.03;
    if (p < hold) return i;
    if (p < AT[i + 1]) return i + ease(seg(p, hold, AT[i + 1] - 0.02));
  }
  return AT.length - 1;
}

function activePanel(p) {
  if (p < AT[0] - 0.06) return -1; // intro
  if (p >= OUTRO[0]) return MARKS.length; // closing card
  let a = 0;
  AT.forEach((t, i) => {
    if (p >= t - 0.06) a = i;
  });
  return a;
}

const HomeDoorMarks = () => {
  const root = useRef(null);
  const stage = useRef(null);
  const world = useRef(null);
  const strip = useRef(null);
  const marks = useRef([]);
  const panels = useRef([]);
  const dots = useRef(null);
  const replayRef = useRef(null);
  const skipped = useRef(false);

  useEffect(() => {
    const el = root.current;
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    installSigTrack();
    dropSkipHash();

    // Analytics: "view" when the moment first comes on screen, "cta" for
    // any link inside it (Skip and Replay have their own events).
    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        if (entries.some((x) => x.isIntersecting)) {
          sig("view");
          io.disconnect();
        }
      });
      io.observe(el);
    }
    const onClick = (e) => {
      const t = e.target.closest && e.target.closest("a, button");
      if (!t || !el.contains(t)) return;
      if (t.classList.contains("dfm-skip") || t.classList.contains("dfm-replay")) return;
      const href = (t.getAttribute("href") || "").split("?")[0];
      sig("cta", { label: (t.textContent || "").replace(/\s+/g, " ").replace("\u2192", "").trim().slice(0, 40), href }, true);
    };
    el.addEventListener("click", onClick);

    if (reduce) {
      el.classList.add("dfm-flat");
      return () => {
        el.removeEventListener("click", onClick);
        if (io) io.disconnect();
      };
    }
    el.classList.add("dfm-live");

    const hdr = document.querySelector(".navbar-head");
    const setHdr = () =>
      el.style.setProperty("--dfm-hdr", (hdr ? hdr.offsetHeight : 92) + "px");
    setHdr();

    let ticking = false;
    let last = -1;
    let shown = -2;
    let done = false;
    // Return visit: show the end state as one normal screen, no pinned scroll.
    let seen = readSeen();
    const applySeen = () => {
      el.classList.toggle("dfm-seen", seen);
      last = -1;
      shown = -2;
    };
    applySeen();
    if (seen) sig("seen_return");

    const frame = () => {
      ticking = false;
      const st = stage.current;
      if (!st || !world.current || !strip.current) return;
      const total = el.offsetHeight - st.offsetHeight;
      const p = seen
        ? 1
        : total > 0
          ? clamp(-el.getBoundingClientRect().top / total, 0, 1)
          : 0;
      if (Math.abs(p - last) < 0.0004) return;
      last = p;
      // A Skip jump passes the whole moment: do not count it as watched.
      if (!seen && !skipped.current) {
        if (p > 0.03) sig("start");
        if (p >= 0.5) sig("half");
        if (p >= 0.97) {
          sig("complete");
          writeSeen(true);
        }
      }

      // The photo window: the current mark sits a little below its middle.
      const winH = world.current.parentElement.offsetHeight;
      const imgH = strip.current.offsetHeight;
      const centre = winH * 0.55;

      // Camera: the current mark sits on the centre line.
      const ci = cameraIndex(p);
      const lo = Math.floor(ci);
      const hi = Math.min(lo + 1, MARKS.length - 1);
      const y = lerp(MARKS[lo].y, MARKS[hi].y, ci - lo) * imgH;
      // Before the first mark, start a little lower, nearer the floor.
      const intro = 1 - ease(seg(p, 0, AT[0]));
      let ty = centre - y + intro * imgH * 0.09;
      ty = clamp(ty, winH - imgH, 0);
      // At the end the camera steps back so all five marks show together.
      const back = ease(seg(p, OUTRO[0] - 0.02, OUTRO[1]));
      const span = (MARKS[0].y - MARKS[MARKS.length - 1].y + 0.1) * imgH;
      const sc = lerp(1, Math.min(1, winH / span), back);
      const topY = (MARKS[MARKS.length - 1].y - 0.045) * imgH;
      const tyEnd = (winH - span * sc) / 2 - topY * sc;
      ty = lerp(ty, tyEnd, back);
      world.current.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;

      MARKS.forEach((m, i) => {
        const draw = ease(seg(p, AT[i] - 0.07, AT[i] - 0.01));
        const node = marks.current[i];
        node.style.setProperty("--dfm-draw", draw.toFixed(3));
        node.classList.toggle("is-on", draw > 0.98 && activePanel(p) === i);
      });

      const a = activePanel(p);
      if (a !== shown) {
        shown = a;
        panels.current.forEach((n, i) => {
          if (!n) return;
          const on = i - 1 === a;
          n.classList.toggle("is-on", on);
          n.setAttribute("aria-hidden", on ? "false" : "true");
          n.querySelectorAll("a").forEach((x) => {
            x.tabIndex = on ? 0 : -1;
          });
        });
        [...dots.current.children].forEach((d, i) => {
          d.classList.toggle("on", a >= i);
        });
        if (a === MARKS.length && !done && !seen) {
          done = true;
          if (window.va) window.va("event", { name: "door_marks_finished" });
        }
      }
      st.style.setProperty("--dfm-hint", (1 - seg(p, 0.01, 0.06)).toFixed(3));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    };
    const onResize = () => {
      setHdr();
      last = -1;
      onScroll();
    };
    replayRef.current = () => {
      writeSeen(false);
      seen = false;
      skipped.current = false;
      applySeen();
      sig("replay", null, true);
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "instant" });
      frame();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const img = strip.current.querySelector("img");
    if (img && !img.complete) img.addEventListener("load", onResize);
    frame();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (img) img.removeEventListener("load", onResize);
      el.removeEventListener("click", onClick);
      if (io) io.disconnect();
      replayRef.current = null;
    };
  }, []);

  const skip = (e) => {
    const next = document.getElementById("after-door-marks");
    if (!next) return;
    e.preventDefault();
    writeSeen(true);
    skipped.current = true;
    sig("skip");
    const top = next.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "instant" });
    dropSkipHash();
  };

  return (
    <>
      <section
        className="dfm"
        ref={root}
        aria-label="Height marks on the door frame: what each age brings"
      >
        <div className="dfm-stage" ref={stage}>
          <a className="dfm-skip" href="#after-door-marks" onClick={skip}>
            Skip
          </a>

          <button
            type="button"
            className="dfm-replay"
            onClick={() => replayRef.current && replayRef.current()}
          >
            <span aria-hidden="true">↺</span> Replay
          </button>

          <div className="dfm-frame">
            <div className="dfm-window" aria-hidden="true">
              <div className="dfm-world" ref={world}>
                <div className="dfm-strip" ref={strip}>
                  <img
                    src="/assets/images/marks/door-frame.webp"
                    srcSet="/assets/images/marks/door-frame-m.webp 560w, /assets/images/marks/door-frame.webp 1000w"
                    sizes="390px"
                    width="1000"
                    height="5651"
                    alt="A painted wooden door frame at home with a child's height marks in pencil"
                    decoding="async"
                  />
                  {MARKS.map((m, i) => (
                    <div
                      key={m.label}
                      className="dfm-mark"
                      ref={(n) => (marks.current[i] = n)}
                      style={{ top: `${m.y * 100}%`, "--dfm-tilt": `${[-0.8, 0.6, -0.4, 0.9, -0.6][i]}deg` }}
                    >
                      <span className="dfm-line" />
                      <span className="dfm-label">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <span className="dfm-caption">Illustrative image</span>
          </div>


          <div className="dfm-panels">
            <div
              className="dfm-panel dfm-intro is-on"
              ref={(n) => (panels.current[0] = n)}
            >
              <p className="dfm-kicker">The door frame at home</p>
              <h2 className="dfm-title" id="dfm-title">
                Every child grows
                <span className="dfm-accent"> one mark at a time.</span>
              </h2>
              <p className="dfm-text">
                Scroll up the frame to see what each age brings, and where on
                this site you can check it.
              </p>
            </div>

            {MARKS.map((m, i) => (
              <div
                key={m.label}
                className="dfm-panel"
                ref={(n) => (panels.current[i + 1] = n)}
                aria-hidden="true"
              >
                <p className="dfm-kicker">{m.kicker}</p>
                <p className="dfm-line-text">{m.line}</p>
                <NavLink to={m.to} className="dfm-go" tabIndex={-1}>
                  {m.cta} <span aria-hidden="true">→</span>
                </NavLink>
              </div>
            ))}

            <div
              className="dfm-panel dfm-end"
              ref={(n) => (panels.current[MARKS.length + 1] = n)}
              aria-hidden="true"
            >
              <p className="dfm-kicker">At every mark</p>
              <p className="dfm-end-title">
                From the first week to the teenage years.
              </p>
              <p className="dfm-text">
                OPD {OPD.days}, 3 pm to 9 pm, at Caspian Healthcare,
                Vijaynagar Colony.
              </p>
              <div className="dfm-actions">
                <a href={BOOKING_URL} className="dfm-book" tabIndex={-1} target="_blank" rel="noopener noreferrer">
                  Book a visit <span aria-hidden="true">→</span>
                </a>
                <NavLink to="/vaccination-guide#vaccine-dates" className="dfm-go" tabIndex={-1}>
                  Vaccine dates
                </NavLink>
                <NavLink to="/growth-development#growth-heading" className="dfm-go" tabIndex={-1}>
                  Growth chart
                </NavLink>
              </div>
            </div>

            <div className="dfm-dots" ref={dots} aria-hidden="true">
              {MARKS.map((m) => (
                <span key={m.label} />
              ))}
            </div>
          </div>

          <div className="dfm-hint" aria-hidden="true">
            Scroll up the frame
          </div>
        </div>
      </section>
      <span id="after-door-marks" className="dfm-anchor" />
    </>
  );
};

export default HomeDoorMarks;
