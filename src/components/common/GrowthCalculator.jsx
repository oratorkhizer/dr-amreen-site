import React, { useEffect, useMemo, useRef, useState } from "react";
import { WHO, IAP, IAP_Z } from "../../data/growth";
import { DOCTOR } from "../../data/site";
import "../../styles/Growth.css";

/*
  Growth calculator for parents.

  Under 5 years: WHO Child Growth Standards (the charts in every Indian
  immunisation card). Weight, length or height, head circumference and BMI
  for age, as a z-score and a percentile, from the LMS values by month.

  5 to 18 years: IAP 2015 charts (Indian Academy of Pediatrics), which are
  the standard for Indian school-age children. Height, weight and BMI for
  age as a percentile band, with the IAP adult-equivalent 23 and 27 BMI lines
  for overweight and obesity. Between the printed ages and percentiles the
  value is interpolated, so the percentile shown is approximate.

  Nothing here is sent anywhere; it is worked out in the browser.
*/

const DAY = 86400000;
const MONTH_DAYS = 30.4375;

function normCdf(z) {
  // Abramowitz and Stegun 7.1.26
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}
function lmsZ(x, L, M, S) {
  if (Math.abs(L) < 1e-6) return Math.log(x / M) / S;
  return (Math.pow(x / M, L) - 1) / (L * S);
}
function whoZ(table, months, x) {
  if (months < 0 || months > 60 || x == null) return null;
  const lo = Math.floor(months);
  const hi = Math.min(60, lo + 1);
  const f = months - lo;
  const a = table[lo];
  const b = table[hi];
  const L = a[0] + (b[0] - a[0]) * f;
  const M = a[1] + (b[1] - a[1]) * f;
  const S = a[2] + (b[2] - a[2]) * f;
  return lmsZ(x, L, M, S);
}
function iapPercentile(table, zcols, years, x) {
  if (years < 5 || years > 18 || x == null) return null;
  const lo = Math.floor(years);
  const hi = Math.min(18, lo + 1);
  const f = years - lo;
  const a = table[String(lo)];
  const b = table[String(hi)];
  const row = a.map((v, i) => v + (b[i] - v) * f);
  // z by interpolating on the normal-quantile scale between bracketing columns
  let z;
  if (x <= row[0]) {
    const slope = (zcols[1] - zcols[0]) / (row[1] - row[0]);
    z = zcols[0] + (x - row[0]) * slope;
  } else if (x >= row[row.length - 1]) {
    const n = row.length;
    const slope = (zcols[n - 1] - zcols[n - 2]) / (row[n - 1] - row[n - 2]);
    z = zcols[n - 1] + (x - row[n - 1]) * slope;
  } else {
    let i = 0;
    while (x > row[i + 1]) i += 1;
    z = zcols[i] + ((x - row[i]) / (row[i + 1] - row[i])) * (zcols[i + 1] - zcols[i]);
  }
  z = Math.max(-4, Math.min(4, z));
  return { z, row, p: normCdf(z) * 100 };
}
function pctText(p) {
  if (p < 1) return "below the 1st percentile";
  if (p > 99) return "above the 99th percentile";
  const n = Math.round(p);
  const s = n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th";
  return `about the ${n}${s} percentile`;
}
function ageText(d0, d1) {
  const days = Math.round((d1 - d0) / DAY);
  if (days < 0) return "";
  if (days < 7 * 8) return `${Math.floor(days / 7)} weeks`;
  // calendar months, the way a clinic counts them
  let months = (d1.getFullYear() - d0.getFullYear()) * 12 + (d1.getMonth() - d0.getMonth());
  if (d1.getDate() < d0.getDate()) months -= 1;
  if (months < 24) return `${months} months`;
  const y = Math.floor(months / 12);
  const m = months - y * 12;
  return m ? `${y} years ${m} months` : `${y} years`;
}

// Plain-words reading of a z-score for each measure. tone: ok, watch, see.
function readWho(kind, z) {
  if (z == null) return null;
  if (kind === "wfa") {
    if (z < -3) return ["see", "Very low weight for age. Please bring your child in this week."];
    if (z < -2) return ["see", "Low weight for age (the underweight range). Worth an assessment, and a look at feeding."];
    if (z > 2) return ["watch", "High weight for age. Read it with the height: a tall child is heavier. The BMI line below helps."];
    return ["ok", "Weight is in the expected range for age."];
  }
  if (kind === "lhfa") {
    if (z < -3) return ["see", "Very short for age. Please bring your child in."];
    if (z < -2) return ["see", "Short for age (the stunting range). One reading can mislead; measure again carefully, and bring the growth card."];
    if (z > 2) return ["watch", "Tall for age. Usually a tall family; mention it at the next visit."];
    return ["ok", "Length or height is in the expected range for age."];
  }
  if (kind === "hcfa") {
    if (z < -2) return ["see", "Head circumference is small for age. Measuring is tricky; let the clinic repeat it."];
    if (z > 2) return ["see", "Head circumference is large for age. Often a family trait, but it should be checked."];
    return ["ok", "Head circumference is in the expected range for age."];
  }
  if (kind === "bmifa") {
    if (z < -3) return ["see", "Very thin for height. Please bring your child in this week."];
    if (z < -2) return ["see", "Thin for height (the wasting range). Worth an assessment."];
    if (z > 3) return ["see", "In the obesity range for age."];
    if (z > 2) return ["watch", "In the overweight range for age."];
    if (z > 1) return ["watch", "Possible risk of overweight. Watch sugary drinks and screen time; no diets for small children."];
    return ["ok", "Weight for height is in the expected range."];
  }
  return null;
}
function readIap(kind, r, sex) {
  if (!r) return null;
  const x = r.z;
  if (kind === "ht") {
    if (x < IAP_Z.ht[0]) return ["see", "Below the 3rd percentile for Indian children of this age: short for age. Please bring your child in."];
    if (x < IAP_Z.ht[1]) return ["watch", "Between the 3rd and 10th percentile. Usually a small family, but the direction over time matters: bring earlier heights."];
    if (x > IAP_Z.ht[6]) return ["watch", "Above the 97th percentile: tall for age. Mention it at the next visit."];
    return ["ok", "Height is in the expected range for Indian children of this age."];
  }
  if (kind === "wt") {
    if (x < IAP_Z.wt[0]) return ["see", "Below the 3rd percentile for age: low weight. Worth an assessment."];
    if (x > IAP_Z.wt[6]) return ["watch", "Above the 97th percentile for age. Read it with the BMI line below."];
    return ["ok", "Weight is in the expected range for age."];
  }
  if (kind === "bmi") {
    const zc = sex === "f" ? IAP_Z.bmi_f : IAP_Z.bmi_m;
    if (x >= zc[6]) return ["see", "At or above the IAP adult-equivalent 27 line: the obesity range for Indian children. Please bring your child in; this is very treatable at this age."];
    if (x >= zc[5]) return ["watch", "At or above the IAP adult-equivalent 23 line: the overweight range for Indian children. Worth a visit before it moves further."];
    if (x < zc[1]) return ["see", "Below the 5th percentile: thin for height. Worth an assessment."];
    return ["ok", "BMI is in the expected range for Indian children of this age."];
  }
  return null;
}

const TONE = { ok: "Expected range", watch: "Worth watching", see: "Bring your child in" };

export default function GrowthCalculator() {
  const [dob, setDob] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sex, setSex] = useState("");
  const [wt, setWt] = useState("");
  const [ht, setHt] = useState("");
  const [hc, setHc] = useState("");
  const [lying, setLying] = useState("");
  const mountRef = useRef(null);
  const [readerReady, setReaderReady] = useState(false);

  // Load the report reader (the same file as on caspianhealthcare.in) only on this page.
  useEffect(() => {
    let cancelled = false;
    function attach() {
      if (cancelled || !window.ReportReader || !mountRef.current || mountRef.current.dataset.ready) return;
      mountRef.current.dataset.ready = "1";
      window.ReportReader.attach({
        mount: mountRef.current,
        title: "Have a printed report, discharge summary or clinic printout?",
        intro: "Upload the PDF or a clear photo. Weight, length or height, head circumference, date of birth and sex are read off it and filled in below. The file is read on this phone and is <strong>not uploaded anywhere</strong>. Handwritten growth cards cannot be read; type those in.",
        button: "Upload report (PDF or photo)",
        fields: { wt: "gc-wt", ht: "gc-ht", hc: "gc-hc", dob: "gc-dob", sex: { id: "gc-sex" } },
        keys: ["age"],
        labels: { wt: "Weight", ht: "Length or height", hc: "Head circumference", dob: "Date of birth", sex: "Sex", age: "Age (years)" },
        show: { sex: { m: "boy", f: "girl" } },
        onFound: (f, C) => {
          // Measurement date is the report date; without a date of birth, work it back from the age printed.
          const newest = C && C.dated.length ? C.dated[C.dated.length - 1].date : null;
          const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          if (newest) setDate(iso(newest));
          if (!f.dob && f.age && newest) {
            const d = new Date(newest.getTime() - f.age.v * 365.25 * DAY);
            setDob(iso(d));
          }
          if (f.dob) setDob(f.dob.v);
          if (f.sex) setSex(f.sex.v);
          if (f.wt) setWt(String(f.wt.v));
          if (f.ht) setHt(String(f.ht.v));
          if (f.hc) setHc(String(f.hc.v));
        },
        onUndo: () => { setWt(""); setHt(""); setHc(""); },
        note: "Check each number against the paper. A photo can lose a decimal point.",
      });
      setReaderReady(true);
    }
    if (window.ReportReader) attach();
    else {
      const s = document.createElement("script");
      s.src = "/assets/report-reader.js";
      s.onload = attach;
      document.head.appendChild(s);
    }
    return () => { cancelled = true; };
  }, []);

  const result = useMemo(() => {
    if (!dob || !date || !sex) return null;
    const d0 = new Date(dob);
    const d1 = new Date(date);
    const days = Math.round((d1 - d0) / DAY);
    if (!(days >= 0)) return { error: "The measurement date is before the date of birth." };
    const months = days / MONTH_DAYS;
    const years = days / 365.25;
    const w = parseFloat(wt) || null;
    let h = parseFloat(ht) || null;
    const head = parseFloat(hc) || null;
    const notes = [];
    // WHO: length under 2 years, standing height from 2. Adjust by 0.7 cm if measured the other way.
    if (h && months < 24 && lying === "standing") { h += 0.7; notes.push("0.7 cm added because a child under 2 was measured standing (WHO rule)."); }
    if (h && months >= 24 && lying === "lying") { h -= 0.7; notes.push("0.7 cm taken off because a child over 2 was measured lying down (WHO rule)."); }
    const bmi = w && h ? w / Math.pow(h / 100, 2) : null;
    const rows = [];
    if (years > 18.01) return { error: "These charts stop at 18 years. For adults, see the BMI and body composition pages on caspianhealthcare.in." };
    if (months <= 60) {
      const sx = sex;
      const add = (kind, label, x, unit) => {
        if (x == null) return;
        const z = whoZ(WHO[`${kind}_${sx}`], months, x);
        if (z == null) return;
        const r = readWho(kind, z);
        rows.push({ label, value: `${Math.round(x * 10) / 10} ${unit}`, z, p: normCdf(z) * 100, tone: r[0], text: r[1], std: "WHO" });
      };
      add("wfa", "Weight for age", w, "kg");
      add("lhfa", months < 24 ? "Length for age" : "Height for age", h, "cm");
      add("hcfa", "Head circumference for age", head, "cm");
      add("bmifa", "BMI for age", bmi, "kg/m²");
      if (months > 36 && head) notes.push("Head circumference is rarely plotted after 3 years; the clinic will decide whether it matters.");
    } else {
      const sx = sex;
      const add = (kind, label, x, unit, table, zc) => {
        if (x == null) return;
        const r = iapPercentile(table, zc, years, x);
        if (!r) return;
        const rd = readIap(kind, r, sx);
        rows.push({ label, value: `${Math.round(x * 10) / 10} ${unit}`, z: r.z, p: r.p, tone: rd[0], text: rd[1], std: "IAP 2015", approx: true });
      };
      add("ht", "Height for age", h, "cm", IAP[`ht_${sx}`], IAP_Z.ht);
      add("wt", "Weight for age", w, "kg", IAP[`wt_${sx}`], IAP_Z.wt);
      add("bmi", "BMI for age", bmi, "kg/m²", IAP[`bmi_${sx}`], sx === "f" ? IAP_Z.bmi_f : IAP_Z.bmi_m);
      if (head) notes.push("Head circumference charts stop at 5 years, so it is not plotted here.");
    }
    if (!rows.length) return { error: "Enter at least one measurement." };
    const worst = rows.some((r) => r.tone === "see") ? "see" : rows.some((r) => r.tone === "watch") ? "watch" : "ok";
    return { days, months, years, rows, notes, worst, bmi };
  }, [dob, date, sex, wt, ht, hc, lying]);

  const months = result && !result.error ? result.months : null;

  return (
    <section className="growth" aria-labelledby="growth-heading">
      <h2 className="article-section-heading" id="growth-heading">Where is my child on the growth chart?</h2>
      <p className="article-paragraph">
        Enter today's measurements and see where they fall. Under 5 years this uses the WHO standards, the charts printed in every immunisation card. From 5 to 18 it uses the IAP 2015 charts for Indian children. Nothing you enter leaves this phone.
      </p>

      <div ref={mountRef} className="growth-reader" style={{ "--primary": "var(--color-primary)", "--navy": "var(--color-heading)", "--muted": "var(--color-text)", "--line": "#cfe6e3", "--tint": "var(--color-primary-soft)", "--ink": "var(--color-text)" }} />

      <div className="growth-form">
        <label><span>Date of birth</span><input id="gc-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={date} /></label>
        <label><span>Date measured</span><input id="gc-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label><span>Sex</span>
          <select id="gc-sex" value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="">Choose</option><option value="m">Boy</option><option value="f">Girl</option>
          </select>
        </label>
        <label><span>Weight <small>kg</small></span><input id="gc-wt" type="number" inputMode="decimal" step="0.01" min="0.5" max="150" value={wt} onChange={(e) => setWt(e.target.value)} placeholder="e.g. 7.1" /></label>
        <label><span>{months != null && months < 24 ? "Length" : "Height"} <small>cm</small></span><input id="gc-ht" type="number" inputMode="decimal" step="0.1" min="35" max="200" value={ht} onChange={(e) => setHt(e.target.value)} placeholder="e.g. 66.5" /></label>
        {(months == null || months <= 60) && (
          <label><span>Head circumference <small>cm, under 5</small></span><input id="gc-hc" type="number" inputMode="decimal" step="0.1" min="25" max="60" value={hc} onChange={(e) => setHc(e.target.value)} placeholder="e.g. 42.8" /></label>
        )}
        {months != null && months >= 18 && months <= 30 && ht && (
          <label><span>Measured how?</span>
            <select value={lying} onChange={(e) => setLying(e.target.value)}>
              <option value="">Not sure</option><option value="lying">Lying down</option><option value="standing">Standing</option>
            </select>
          </label>
        )}
      </div>

      {result && result.error && <p className="growth-error">{result.error}</p>}

      {result && !result.error && (
        <div className={`growth-result growth-${result.worst}`} aria-live="polite">
          <p className="growth-age">
            Age at measurement: <strong>{ageText(new Date(dob), new Date(date))}</strong>
            {result.bmi ? <> · BMI <strong>{Math.round(result.bmi * 10) / 10}</strong></> : null}
            <span className="growth-std">{result.rows[0].std} charts</span>
          </p>
          <div className="growth-rows">
            {result.rows.map((r) => (
              <div className={`growth-row tone-${r.tone}`} key={r.label}>
                <div className="growth-row-head">
                  <span className="growth-label">{r.label}</span>
                  <span className="growth-value">{r.value}</span>
                </div>
                <div className="growth-pct">
                  <strong>{pctText(r.p)}</strong>{r.approx ? " (approximate)" : ""}, z-score {r.z > 0 ? "+" : ""}{Math.round(r.z * 100) / 100}
                </div>
                <div className="growth-bar" aria-hidden="true">
                  <span className="growth-band" />
                  <span className="growth-dot" style={{ left: `${Math.max(2, Math.min(98, 50 + Math.max(-3.5, Math.min(3.5, r.z)) * 13.5))}%` }} />
                </div>
                <div className="growth-read"><span className="growth-tone">{TONE[r.tone]}.</span> {r.text}</div>
              </div>
            ))}
          </div>
          {result.notes.map((n) => <p className="growth-note" key={n}>{n}</p>)}
          <p className="growth-note">
            One measurement is a dot; growth is the line. Bring the growth card, or earlier weights and heights, so {DOCTOR.shortName} can see the direction. Measure length lying down under 2 years and standing height after, without shoes.
          </p>
        </div>
      )}
      {!readerReady && <noscript><p className="growth-note">The calculator needs JavaScript.</p></noscript>}
    </section>
  );
}
