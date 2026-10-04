import React, { useMemo, useState } from "react";
import { parseDob } from "../../data/vaccines";
import { BOOKING_URL } from "../../data/site";
import "../../styles/Milestones.css";

/*
  Milestone check for parents, on /growth-development.

  Each band lists things MOST children (about 3 in 4) can do by that age,
  following the CDC "Learn the Signs. Act Early." milestones (2022 revision),
  which were written so that missing one is a reason to ask, not to panic.
  Items marked `ask` match the red flags already printed on the article
  ("Ask for an assessment if your child..."); missing one of those, or losing
  a skill, gives the stronger message.

  Babies born more than 3 weeks early use their corrected age up to 2 years.
  Nothing is sent anywhere; it all runs in the browser.
*/

const BANDS = [
  { months: 2, label: "2 months", items: [
    { t: "Calms down when spoken to or picked up" },
    { t: "Looks at your face" },
    { t: "Lifts the head when lying on the tummy" },
    { t: "Makes sounds other than crying (cooing)" },
  ] },
  { months: 4, label: "4 months", items: [
    { t: "Holds the head steady without support when held", ask: true },
    { t: "Smiles on their own to get your attention" },
    { t: "Brings hands to the mouth" },
    { t: "Pushes up onto the elbows when on the tummy" },
  ] },
  { months: 6, label: "6 months", items: [
    { t: "Laughs" },
    { t: "Reaches to grab a toy" },
    { t: "Rolls from tummy to back" },
    { t: "Takes turns making sounds with you" },
  ] },
  { months: 9, label: "9 months", items: [
    { t: "Sits without support", ask: true },
    { t: "Turns when you call their name" },
    { t: "Moves things from one hand to the other" },
    { t: "Looks for a toy when it is dropped out of sight" },
  ] },
  { months: 12, label: "12 months", items: [
    { t: "Pulls up to stand" },
    { t: "Waves bye-bye" },
    { t: "Calls a parent \"mama\", \"dada\" or another special name" },
    { t: "Picks up small things between thumb and finger" },
  ] },
  { months: 15, label: "15 months", items: [
    { t: "Takes a few steps alone" },
    { t: "Tries to say one or two words besides \"mama\" or \"dada\"" },
    { t: "Points to ask for something" },
    { t: "Shows you a toy they like" },
  ] },
  { months: 18, label: "18 months", items: [
    { t: "Walks without holding on to anything", ask: true },
    { t: "Says three or more words besides \"mama\" or \"dada\"", ask: true },
    { t: "Points to show you something interesting" },
    { t: "Scribbles, and tries to use a spoon" },
  ] },
  { months: 24, label: "2 years", items: [
    { t: "Says at least two words together, like \"more milk\"", ask: true },
    { t: "Kicks a ball" },
    { t: "Points to things in a book when you ask" },
    { t: "Notices when someone is hurt or upset" },
  ] },
  { months: 36, label: "3 years", items: [
    { t: "Talks well enough for others to understand most of the time" },
    { t: "Says their first name when asked" },
    { t: "Draws a circle when you show how" },
    { t: "Notices other children and joins them to play" },
  ] },
  { months: 48, label: "4 years", items: [
    { t: "Says sentences of four or more words" },
    { t: "Catches a large ball most of the time" },
    { t: "Pretends to be something else during play" },
    { t: "Names a few colours" },
  ] },
  { months: 60, label: "5 years", items: [
    { t: "Tells a story with at least two events" },
    { t: "Counts to 10" },
    { t: "Hops on one foot" },
    { t: "Follows the rules of a simple game" },
  ] },
];

// Things that matter at any age, whatever the band.
const ALWAYS = [
  { t: "Makes eye contact and responds when you call their name", ask: true, minMonths: 9 },
  { t: "Still does everything they could do before, with no lost words or skills", ask: true, minMonths: 0 },
];

function monthsBetween(d0, d1) {
  let m = (d1.getFullYear() - d0.getFullYear()) * 12 + (d1.getMonth() - d0.getMonth());
  if (d1.getDate() < d0.getDate()) m -= 1;
  return m;
}

export default function MilestoneChecker() {
  const [dobText, setDobText] = useState("");
  const [weeksEarly, setWeeksEarly] = useState("0");
  const [ticks, setTicks] = useState({});
  const [checkedBand, setCheckedBand] = useState(null);

  const result = useMemo(() => {
    const dob = parseDob(dobText);
    if (!dob) return null;
    const now = new Date();
    let months = monthsBetween(dob, now);
    if (months < 0) return { error: "That date is in the future." };
    const early = Number(weeksEarly) || 0;
    let corrected = false;
    if (early >= 3 && months < 24) {
      months = Math.max(0, Math.round(months - (early * 7) / 30.4375));
      corrected = true;
    }
    if (months < 2) {
      return { error: "Milestone checks start at 2 months. Until then, feeding, sleep and weight gain are the things to watch." };
    }
    const band = [...BANDS].reverse().find((b) => months >= b.months) || BANDS[0];
    const items = [
      ...band.items,
      ...ALWAYS.filter((a) => months >= a.minMonths),
    ];
    return { months, corrected, band, items };
  }, [dobText, weeksEarly]);

  const bandKey = result && result.band ? result.band.months : null;
  const isTicked = (t) => Boolean(ticks[`${bandKey}|${t}`]);
  const toggle = (t) => { setCheckedBand(null); setTicks((prev) => ({ ...prev, [`${bandKey}|${t}`]: !prev[`${bandKey}|${t}`] })); };

  let verdict = null;
  if (result && result.items && checkedBand === bandKey) {
    const missing = result.items.filter((i) => !isTicked(i.t));
    const missingAsk = missing.filter((i) => i.ask);
    if (missing.length === 0) {
      verdict = ["ok", "On track for this age. Keep talking, reading and playing together."];
    } else if (missingAsk.length > 0) {
      verdict = ["see", `${missingAsk.length === 1 ? "One of the key skills is" : "Some key skills are"} not there yet. Please ask for an assessment rather than waiting: if there is a delay, help that starts early works best.`];
    } else if (missing.length <= 2) {
      verdict = ["watch", "Not every box is ticked, and that is common. Children do things in their own order. Try again in a month, and mention it at the next visit."];
    } else {
      verdict = ["see", "Several of these are not there yet. Please book a visit so we can look at development properly."];
    }
  }

  return (
    <section className="milestones" aria-labelledby="milestones-heading">
      <h2 className="milestones-heading" id="milestones-heading">Check the milestones</h2>
      <p className="milestones-intro">
        Enter the date of birth, then tick what your child can do today. The
        list is what most children can do by that age, so one missing item is
        a reason to ask, not to worry.
      </p>

      <div className="milestones-form">
        <label>
          Child's date of birth
          <input type="date" value={dobText} onChange={(e) => { setDobText(e.target.value); }} />
        </label>
        <label>
          Born early?
          <select value={weeksEarly} onChange={(e) => setWeeksEarly(e.target.value)}>
            <option value="0">No, born on time</option>
            {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => (
              <option key={w} value={String(w)}>{w} weeks early</option>
            ))}
          </select>
        </label>
      </div>

      {result && result.error && <p className="milestones-error">{result.error}</p>}

      {result && result.items && (
        <div className="milestones-result">
          <p className="milestones-age">
            Checking against <strong>{result.band.label}</strong>
            {result.corrected ? " (corrected age, because your baby was born early)" : ""}.
          </p>

          <ul className="milestones-list">
            {result.items.map((item) => (
              <li key={item.t}>
                <label className={isTicked(item.t) ? "is-ticked" : ""}>
                  <input type="checkbox" checked={isTicked(item.t)} onChange={() => toggle(item.t)} />
                  <span>{item.t}</span>
                </label>
              </li>
            ))}
          </ul>

          {!verdict && (
            <button type="button" className="milestones-button milestones-check" onClick={() => setCheckedBand(bandKey)}>
              See what this means
            </button>
          )}

          {verdict && (
            <div className={`milestones-verdict tone-${verdict[0]}`} role="status">
              <p>{verdict[1]}</p>
              {verdict[0] !== "ok" && (
                <a className="milestones-button" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book a development check <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}

          <p className="milestones-note">
            Based on the CDC "Learn the Signs. Act Early." milestones. This is a
            check for parents, not a diagnosis. Nothing you tick is sent anywhere.
          </p>
        </div>
      )}
    </section>
  );
}
