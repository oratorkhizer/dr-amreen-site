import React, { useEffect, useRef, useState } from "react";
import DateEcho from "../common/DateEcho";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BOOK,
  BOOKING_URL,
  CLINIC,
  DOCTOR,
  GOOGLE_REVIEWS_URL,
  INSTAGRAM,
  OPD,
  REELS,
} from "../../data/site";
import CareIcon from "../common/CareIcon";
import "../../styles/Home/HomeNew.css";

/* Home page, Nov 2026 redesign. Six sections and nothing else:
   hero (with the vaccine date box), emergency note, Reels, parent tools,
   Dear Mama, the clinic. The door frame marks sit between hero and note.
   Every Book button goes straight to her Eka page. */

const ext = { target: "_blank", rel: "noopener noreferrer" };

function todayIso() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(
    n.getDate()
  ).padStart(2, "0")}`;
}

export const HomeHero = () => {
  const navigate = useNavigate();
  const [dob, setDob] = useState("");
  const [max, setMax] = useState(undefined);
  useEffect(() => setMax(todayIso()), []);

  const showDates = (event) => {
    event.preventDefault();
    if (!dob) return;
    navigate(`/vaccination-guide?dob=${dob}#vaccine-dates`);
  };

  return (
    <section className="hm-hero" aria-labelledby="hm-hero-title">
      <div className="hm-wrap hm-hero-grid">
        <div className="hm-hero-copy">
          <p className="hm-label">Pediatrician · Caspian Healthcare, Hyderabad</p>
          <h1 className="hm-hero-title" id="hm-hero-title">
            Your child's doctor,{" "}
            <span className="hm-mark">and a mom of three.</span>
          </h1>
          <p className="hm-hero-text">
            {DOCTOR.name} sees children from the first week of life to the
            teenage years at {CLINIC.name}, Vijaynagar Colony. Gold medallist,
            trained at Niloufer Hospital.
          </p>

          <div className="hm-actions">
            <a className="hm-btn hm-btn-main" href={BOOKING_URL} {...ext}>
              Book a visit
            </a>
            <a className="hm-btn hm-btn-soft" href={CLINIC.mapsUrl} {...ext}>
              Directions
            </a>
          </div>

          <ul className="hm-facts" aria-label="Clinic at a glance">
            <li>
              <strong>Mon to Sat</strong>3 pm to 9 pm
            </li>
            <li>
              <strong>Rs {DOCTOR.consultationFee}</strong>consultation
            </li>
            <li>
              <strong>{INSTAGRAM.followers}</strong>parents follow her
            </li>
          </ul>
        </div>

        <div className="hm-hero-side">
          <figure className="hm-portrait">
            <img
              src="/assets/images/clinic/dr-amreen-hero.jpg"
              srcSet="/assets/images/clinic/dr-amreen-hero-small.jpg 460w, /assets/images/clinic/dr-amreen-hero.jpg 840w"
              sizes="(max-width: 760px) 70vw, 380px"
              alt={`${DOCTOR.name}, pediatrician at ${CLINIC.name}, Hyderabad`}
              width="840"
              height="1029"
              fetchPriority="high"
            />
            <figcaption>
              {DOCTOR.name}
              <span>{DOCTOR.qualifications}</span>
            </figcaption>
          </figure>

          <form className="hm-vax" onSubmit={showDates} aria-labelledby="hm-vax-title">
            <p className="hm-vax-title" id="hm-vax-title">
              Never miss a vaccine
            </p>
            <p className="hm-vax-text">
              Enter your baby's date of birth. See every due date, and get a
              WhatsApp reminder before each one.
            </p>
            <label className="hm-vax-row">
              <span className="hm-sr">Baby's date of birth</span>
              <input
                type="date"
                value={dob}
                max={max}
                required
                onChange={(e) => setDob(e.target.value)}
              />
              <button type="submit" className="hm-btn hm-btn-main">
                Show my dates
              </button>
              <DateEcho value={dob} />
            </label>
          </form>
        </div>
      </div>
    </section>
  );
};

// From the approved red-flag lists on the illness and newborn guides.
// Caspian has no children's emergency or ward, so this sends parents to a
// hospital emergency department and never to the clinic.
const RED_FLAGS = [
  "Is under 3 months and has any fever",
  "Is breathing fast, or the chest is pulling in with each breath",
  "Is drowsy, floppy, or very difficult to wake",
  "Has a fit or seizure",
  "Is not passing urine, or has a dry mouth and no tears",
  "Has a rash that does not fade when you press a glass on it",
];

export const HomeUrgent = () => (
  <section className="hm-urgent" aria-labelledby="hm-urgent-title">
    <div className="hm-wrap">
      <div className="hm-note">
        <div className="hm-note-head">
          <p className="hm-note-pin" aria-hidden="true">!</p>
          <h2 className="hm-note-title" id="hm-urgent-title">
            Is this an emergency?
          </h2>
          <p className="hm-note-lead">
            Go to the nearest hospital emergency department now if your child:
          </p>
        </div>
        <ul className="hm-note-list">
          {RED_FLAGS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="hm-note-foot">
          {CLINIC.name} does not have a children's emergency or a children's
          ward. For everything else, book a visit with {DOCTOR.name}.{" "}
          <NavLink to="/childhood-illnesses">When to worry about fever and other illnesses</NavLink>
        </p>
      </div>
    </div>
  </section>
);

// Instagram's own player, loaded only once the section comes near the
// screen, so the page stays light and the covers are her real frames.
// Until Instagram has drawn the video, a play mark and a label sit on top,
// so the card never shows as an empty box (audit 3 Nov 2026).
const ReelEmbed = ({ id, title, load }) => {
  const [ready, setReady] = useState(false);
  return (
    <figure className="hm-reel">
      <div className={ready ? "hm-reel-frame is-ready" : "hm-reel-frame"}>
        {load && (
          <iframe
            src={`https://www.instagram.com/reel/${id}/embed/`}
            title={title}
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            onLoad={() => setReady(true)}
          />
        )}
        <span className="hm-reel-cover" aria-hidden="true">
          <span className="hm-reel-play">▶</span>
          <span className="hm-reel-label">Video from her Instagram</span>
        </span>
      </div>
      <figcaption>{title}</figcaption>
    </figure>
  );
};

export const HomeReels = () => {
  const ref = useRef(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setLoad(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="hm-reels" ref={ref} aria-labelledby="hm-reels-title">
      <div className="hm-wrap">
        <div className="hm-head">
          <p className="hm-label">From her Instagram</p>
          <h2 className="hm-title" id="hm-reels-title">
            One minute of advice,{" "}
            <span className="hm-mark">from one mother to another.</span>
          </h2>
        </div>
        <div className="hm-reel-row">
          {REELS.map((r) => (
            <ReelEmbed key={r.id} {...r} load={load} />
          ))}
        </div>
        <a className="hm-link" href={INSTAGRAM.url} {...ext}>
          Follow {INSTAGRAM.handle} on Instagram ↗
        </a>
      </div>
    </section>
  );
};

const TOOLS = [
  {
    to: "/vaccination-guide#vaccine-dates",
    icon: "vaccination",
    title: "Your child's vaccine dates",
    text: "Every visit on the IAP 2023 schedule, with WhatsApp or calendar reminders.",
  },
  {
    to: "/growth-development#growth-heading",
    icon: "growth",
    title: "Is my child growing well?",
    text: "Plot weight, height and head size on the WHO and IAP charts.",
  },
  {
    to: "/growth-development#milestones-heading",
    icon: "listen",
    title: "Milestone check",
    text: "What most children can do by your child's age.",
  },
  {
    to: "/new-mothers",
    icon: "newborn",
    title: "Expecting a baby?",
    text: "Meet your baby's doctor before the birth.",
  },
];

const GUIDES = [
  { to: "/newborn-care", label: "Newborn care" },
  { to: "/child-nutrition", label: "Feeding by age" },
  { to: "/vaccination-guide", label: "Vaccination guide" },
  { to: "/growth-development", label: "Growth and milestones" },
  { to: "/childhood-illnesses", label: "Common illnesses" },
];

export const HomeTools = () => (
  <section className="hm-tools" aria-labelledby="hm-tools-title">
    <div className="hm-wrap">
      <div className="hm-head">
        <p className="hm-label">Tools for parents</p>
        <h2 className="hm-title" id="hm-tools-title">
          Answers you can get <span className="hm-mark">at home, tonight.</span>
        </h2>
      </div>
      <div className="hm-tool-grid">
        {TOOLS.map((t) => (
          <NavLink key={t.title} to={t.to} className="hm-tool">
            <CareIcon name={t.icon} className="hm-tool-icon" />
            <span className="hm-tool-title">{t.title}</span>
            <span className="hm-tool-text">{t.text}</span>
          </NavLink>
        ))}
      </div>
      <nav className="hm-guides" aria-label="Guides for parents">
        <span>Guides for parents:</span>
        {GUIDES.map((g) => (
          <NavLink key={g.to} to={g.to}>
            {g.label}
          </NavLink>
        ))}
      </nav>
    </div>
  </section>
);

export const HomeBook = () => (
  <section className="hm-book" aria-labelledby="hm-book-title">
    <div className="hm-wrap hm-book-grid">
      <img
        className="hm-book-cover"
        src={BOOK.cover}
        alt={`Cover of ${BOOK.title}: ${BOOK.subtitle} by ${BOOK.author}`}
        width="520"
        height="802"
        loading="lazy"
        decoding="async"
      />
      <div>
        <p className="hm-label">Her book for new mothers</p>
        <h2 className="hm-title" id="hm-book-title">
          {BOOK.title}: <span className="hm-mark">{BOOK.subtitle}</span>
        </h2>
        <p className="hm-book-text">{BOOK.blurb}</p>
        <p className="hm-book-meta">
          {BOOK.publisher}, {BOOK.published}. {BOOK.pages} pages.
        </p>
        <div className="hm-actions">
          <a className="hm-btn hm-btn-main" href={BOOK.amazonUrl} {...ext}>
            Get it on Amazon ↗
          </a>
          <NavLink className="hm-btn hm-btn-soft" to="/new-mothers">
            For new mothers
          </NavLink>
        </div>
      </div>
    </div>
  </section>
);

export const HomeClinic = () => (
  <section className="hm-clinic" aria-labelledby="hm-clinic-title">
    <div className="hm-wrap hm-clinic-grid">
      <figure className="hm-room">
        <img
          src="/assets/images/clinic/childrens-room.webp"
          alt={`${DOCTOR.name} with a young child and the Caspian team in the children's room, under the painted animal wall`}
          width="560"
          height="745"
          loading="lazy"
          decoding="async"
        />
        <figcaption>The children's room at {CLINIC.name}</figcaption>
      </figure>

      <div className="hm-clinic-copy">
        <p className="hm-label">Visit the clinic</p>
        <h2 className="hm-title" id="hm-clinic-title">
          {CLINIC.name}, <span className="hm-mark">Vijaynagar Colony.</span>
        </h2>
        <dl className="hm-details">
          <div>
            <dt>Address</dt>
            <dd>
              {CLINIC.addressLine1}, {CLINIC.addressLine2}, {CLINIC.city}{" "}
              {CLINIC.postalCode}, {CLINIC.state}
            </dd>
          </div>
          <div>
            <dt>OPD</dt>
            <dd>
              {OPD.days}, {OPD.hours}. {OPD.closed}.
            </dd>
          </div>
          <div>
            <dt>Consultation</dt>
            <dd>Rs {DOCTOR.consultationFee}, paid at reception</dd>
          </div>
          <div>
            <dt>Reception</dt>
            <dd>
              <a href={`tel:${CLINIC.phoneE164}`}>{CLINIC.phone}</a>, for directions
              and reports. Appointments are booked online.
            </dd>
          </div>
        </dl>
        <div className="hm-actions">
          <a className="hm-btn hm-btn-main" href={BOOKING_URL} {...ext}>
            Book a visit
          </a>
          <a className="hm-btn hm-btn-soft" href={CLINIC.mapsUrl} {...ext}>
            Directions ↗
          </a>
        </div>
        <p className="hm-small-links">
          <NavLink to="/about">Meet {DOCTOR.name}</NavLink>
          <a href={GOOGLE_REVIEWS_URL} {...ext}>
            Read parents' reviews on Google ↗
          </a>
        </p>
      </div>
    </div>
  </section>
);
