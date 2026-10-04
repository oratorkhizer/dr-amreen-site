import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ReelCard from "../components/common/ReelCard";
import {
  BOOK,
  BOOKING_URL,
  CLINIC,
  DOCTOR,
  OPD,
  REEL_FOR_MOTHERS,
} from "../data/site";
import "../styles/Article.css";
import "../styles/Reels.css";
import "../styles/NewMothers.css";

// For expecting and new mothers. Everything clinical on this page repeats
// what the newborn care and vaccination pages already say, so the advice
// stays consistent across the site. Checklist ticks stay in this browser.

const TALK_ABOUT = [
  ["Feeding from the first hour", "How to start breastfeeding, how to tell your baby is getting enough, and when a top feed is and is not needed."],
  ["What happens at birth", "The first vaccines (BCG, oral polio and hepatitis B), and what the hospital team checks before you go home."],
  ["Jaundice", "Which yellowness is common in the first week, and which needs a check the same day."],
  ["What to buy, and what to skip", "Most baby products are not needed. Powder, honey, ghutti and gripe water are things your baby can do without."],
  ["Your first weeks at home", "Sleep, cord care, crying, and the danger signs worth knowing before the baby arrives."],
];

const CHECKLIST = [
  { id: "birth-vaccines", when: "At birth", text: "BCG, oral polio and hepatitis B given before going home. Ask for the vaccination card." },
  { id: "first-feed", when: "First hour", text: "First breastfeed within an hour of birth." },
  { id: "first-check", when: "Within the first week", text: "First check with the pediatrician: weight, feeding and jaundice." },
  { id: "feeds", when: "Every day", text: "Eight to twelve feeds in 24 hours, including at night. Nothing but breast milk unless a doctor advises a top feed." },
  { id: "nappies", when: "Every day", text: "Six or more wet nappies a day once feeding is settled." },
  { id: "sleep", when: "Every sleep", text: "On the back, on a firm flat surface, with no pillows or soft toys." },
  { id: "cord", when: "Day 5 to 15", text: "Cord stump kept clean and dry with nothing applied. It falls off by itself." },
  { id: "weight", when: "By 2 weeks", text: "Back to birth weight." },
  { id: "six-weeks", when: "6 weeks", text: "Six week check and the first set of vaccines. Use the planner to see the date." },
];

const NewMothers = () => {
  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem("newMothersChecklist") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("newMothersChecklist", JSON.stringify(done));
    } catch {
      // private mode or storage blocked: ticks just won't be remembered
    }
  }, [done]);

  return (
    <main className="article-page new-mothers" id="main-content">
      <section className="article-hero">
        <div className="article-container">
          <nav className="article-breadcrumb" aria-label="Breadcrumb">
            <NavLink to="/">Home</NavLink>
            <span aria-hidden="true">›</span>
            <span>For new mothers</span>
          </nav>

          <span className="article-eyebrow">Expecting a baby?</span>

          <h1 className="article-title">
            Meet your baby's doctor
            <span className="article-title-accent">before the birth.</span>
          </h1>

          <p className="article-intro">
            Most parents meet their pediatrician for the first time with a
            crying newborn and no sleep. A visit in the last two months of
            pregnancy is calmer: you ask everything, you know who to call, and
            the first weeks hold fewer surprises.
          </p>

          <div className="new-mothers-hero-actions">
            <a className="new-mothers-button" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              Book a visit before the birth <span aria-hidden="true">↗</span>
            </a>
            <span className="new-mothers-fee">
              A normal consultation, Rs {DOCTOR.consultationFee}. {OPD.days}, {OPD.hours}.
            </span>
          </div>
        </div>
      </section>

      <section className="new-mothers-section">
        <div className="article-container new-mothers-two">
          <div>
            <h2 className="new-mothers-heading">What we talk about</h2>
            <p className="new-mothers-lead">
              Come with your partner or your mother if you like. Bring your
              questions written down; there are no silly ones.
            </p>
          </div>
          <ol className="new-mothers-talk">
            {TALK_ABOUT.map(([title, text]) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="new-mothers-section new-mothers-checklist-wrap" id="first-six-weeks">
        <div className="article-container">
          <div className="new-mothers-checklist-head">
            <div>
              <h2 className="new-mothers-heading">The first six weeks, on one page</h2>
              <p className="new-mothers-lead">
                Tick as you go, or print it and stick it on the fridge. Your ticks
                are remembered on this phone only.
              </p>
            </div>
            <button type="button" className="new-mothers-print" onClick={() => window.print()}>
              Print the checklist
            </button>
          </div>

          <ul className="new-mothers-checklist">
            {CHECKLIST.map((item) => (
              <li key={item.id}>
                <label className={done[item.id] ? "is-done" : ""}>
                  <input
                    type="checkbox"
                    checked={Boolean(done[item.id])}
                    onChange={() => setDone((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                  />
                  <span className="new-mothers-when">{item.when}</span>
                  <span className="new-mothers-what">{item.text}</span>
                </label>
              </li>
            ))}
          </ul>

          <p className="new-mothers-small">
            The danger signs for a newborn, and what to do about each, are on the{" "}
            <NavLink to="/newborn-care">newborn care page</NavLink>. Once your baby is
            born, the <NavLink to="/vaccination-guide#vaccine-dates">vaccine planner</NavLink>{" "}
            gives you the date of every visit. {CLINIC.name} does not run a
            paediatric emergency: if your newborn looks unwell outside OPD hours,
            go to the nearest hospital with a children's emergency department.
          </p>
        </div>
      </section>

      <section className="new-mothers-section">
        <div className="article-container new-mothers-book">
          <img
            className="new-mothers-cover"
            src={BOOK.cover}
            alt={`Cover of ${BOOK.title}: ${BOOK.subtitle} by ${BOOK.author}`}
            width="520"
            height="802"
            loading="lazy"
            decoding="async"
          />
          <div className="new-mothers-book-text">
            <h2 className="new-mothers-heading">
              For you, not only the baby: <em>{BOOK.title}</em>
            </h2>
            <p className="new-mothers-strap">{BOOK.strapline}</p>
            <p className="new-mothers-lead">{BOOK.blurb}</p>
            <a className="new-mothers-button" href={BOOK.amazonUrl} target="_blank" rel="noopener noreferrer">
              Get {BOOK.title} on Amazon <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="new-mothers-reel">
            <ReelCard id={REEL_FOR_MOTHERS.id} title={REEL_FOR_MOTHERS.title} tone={1} />
          </div>
        </div>
      </section>

      <section className="article-disclaimer">
        <div className="article-container">
          <p>
            This page is general guidance for parents. It does not replace a
            consultation. If you are worried about your baby, please bring them in.
          </p>
        </div>
      </section>
    </main>
  );
};

export default NewMothers;
