// ============================================================
//  CHILDHOOD VACCINE SCHEDULE
//  Source: IAP ACVIP Recommended Immunization Schedule 2023
//  (Indian Pediatrics, February 2024, Table I and Figure 1).
//  Verified against the published table on 4 October 2026.
//
//  This one file feeds three things, so they can never disagree:
//    1. the schedule outline on /vaccination-guide
//    2. the "your child's vaccine dates" planner on the same page
//    3. the reminder list the clinic team sees on /enquiries
//
//  If IAP revises the schedule, change it here and nowhere else.
//  Each visit is due a fixed number of DAYS (weeks) or calendar
//  MONTHS / YEARS after the date of birth.
// ============================================================

export const SCHEDULE_SOURCE =
  "IAP ACVIP Recommended Immunization Schedule, 2023";

export const VISITS = [
  {
    key: "birth",
    age: "At birth",
    at: { days: 0 },
    vaccines: ["BCG", "Oral polio (OPV)", "Hepatitis B, dose 1"],
    note: "BCG before going home; hepatitis B within 24 hours of birth.",
  },
  {
    key: "w6",
    age: "6 weeks",
    at: { days: 42 },
    vaccines: [
      "DTwP or DTaP, dose 1",
      "IPV, dose 1",
      "Hib, dose 1",
      "Hepatitis B, dose 2",
      "Rotavirus, dose 1",
      "Pneumococcal (PCV), dose 1",
    ],
  },
  {
    key: "w10",
    age: "10 weeks",
    at: { days: 70 },
    vaccines: [
      "DTwP or DTaP, dose 2",
      "IPV, dose 2",
      "Hib, dose 2",
      "Hepatitis B, dose 3",
      "Rotavirus, dose 2",
      "Pneumococcal (PCV), dose 2",
    ],
  },
  {
    key: "w14",
    age: "14 weeks",
    at: { days: 98 },
    vaccines: [
      "DTwP or DTaP, dose 3",
      "IPV, dose 3",
      "Hib, dose 3",
      "Hepatitis B, dose 4",
      "Rotavirus, dose 3",
      "Pneumococcal (PCV), dose 3",
    ],
  },
  {
    key: "m6",
    age: "6 months",
    at: { months: 6 },
    vaccines: [
      "Influenza, dose 1",
      "Typhoid conjugate vaccine (any time between 6 and 9 months)",
    ],
    note: "One dose of typhoid conjugate vaccine. IAP does not recommend a booster.",
  },
  {
    key: "m7",
    age: "7 months",
    at: { months: 7 },
    vaccines: ["Influenza, dose 2"],
    note: "After these two doses, a flu vaccine every year before the monsoon, up to 5 years of age.",
  },
  {
    key: "m9",
    age: "9 months",
    at: { months: 9 },
    vaccines: ["MMR, dose 1"],
  },
  {
    key: "m12",
    age: "12 months",
    at: { months: 12 },
    vaccines: ["Hepatitis A, dose 1"],
    note: "The live hepatitis A vaccine is a single dose. The inactivated vaccine needs a second dose at 18 to 19 months.",
  },
  {
    key: "m15",
    age: "15 months",
    at: { months: 15 },
    vaccines: [
      "MMR, dose 2",
      "Chickenpox (varicella), dose 1",
      "Pneumococcal (PCV) booster",
    ],
  },
  {
    key: "m16",
    age: "16 to 18 months",
    at: { months: 16 },
    vaccines: [
      "DTwP or DTaP, first booster",
      "Hib, booster",
      "IPV, booster",
    ],
  },
  {
    key: "m18",
    age: "18 to 19 months",
    at: { months: 18 },
    vaccines: [
      "Chickenpox (varicella), dose 2",
      "Hepatitis A, dose 2 (only if the inactivated vaccine was used)",
    ],
  },
  {
    key: "y4",
    age: "4 to 6 years",
    at: { years: 4 },
    vaccines: [
      "DTwP or DTaP, second booster",
      "IPV, second booster",
      "MMR, dose 3",
    ],
  },
  {
    key: "y9",
    age: "9 to 14 years",
    at: { years: 9 },
    vaccines: ["HPV, 2 doses, 6 months apart"],
    note: "Started after 15 years, HPV needs 3 doses.",
  },
  {
    key: "y10",
    age: "10 years",
    at: { years: 10 },
    vaccines: ["Tdap"],
    note: "Given at 10 even if Tdap was given earlier.",
  },
  {
    key: "y16",
    age: "16 to 18 years",
    at: { years: 16 },
    vaccines: ["Td"],
  },
];

// Yearly flu vaccine between 1 and 5 years. IAP advises giving it in the
// pre-monsoon period, so the planner puts it in May.
export const FLU_MONTH = 4; // 0-based: May
export const FLU_UNTIL_YEARS = 5;

export const OPTIONAL_NOTE =
  "Some vaccines are given only in certain situations, such as meningococcal, Japanese encephalitis, cholera and rabies. Ask at the clinic whether your child needs any of them.";

// ------------------------------------------------------------
// Date helpers. Calendar months are added the way a clinic counts
// them: 6 months after 31 January is 31 July, and after 31 August it
// is the last day of February.
// ------------------------------------------------------------

export function addMonths(date, months) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setMonth(d.getMonth() + months);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(date.getDate(), lastDay));
  return d;
}

export function dueDate(dob, at) {
  if (at.days != null) {
    const d = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
    d.setDate(d.getDate() + at.days);
    return d;
  }
  if (at.months != null) return addMonths(dob, at.months);
  return addMonths(dob, at.years * 12);
}

export function parseDob(value) {
  // value is yyyy-mm-dd from <input type="date">; build a local date
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function fluDates(dob) {
  const out = [];
  const first = addMonths(dob, 12);
  const last = addMonths(dob, FLU_UNTIL_YEARS * 12);
  for (let y = first.getFullYear(); y <= last.getFullYear(); y += 1) {
    const d = new Date(y, FLU_MONTH, 1);
    if (d >= first && d <= last) out.push(d);
  }
  return out;
}

// Every dated item for one child, in order.
export function planFor(dob) {
  const items = VISITS.map((visit) => ({
    key: visit.key,
    age: visit.age,
    date: dueDate(dob, visit.at),
    vaccines: visit.vaccines,
    note: visit.note,
  }));

  fluDates(dob).forEach((date) => {
    items.push({
      key: `flu-${date.getFullYear()}`,
      age: "Yearly",
      date,
      vaccines: ["Influenza, yearly dose"],
      note: "Before the monsoon, every year up to 5 years of age.",
    });
  });

  return items.sort((a, b) => a.date - b.date);
}

export const formatDate = (date) =>
  date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
