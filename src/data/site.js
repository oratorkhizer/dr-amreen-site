// ============================================================
//  SINGLE SOURCE OF TRUTH FOR THE SITE
//  Change a detail here and it updates everywhere:
//  navbar, footer, contact page, schema.org data and meta tags.
// ============================================================

export const SITE_URL = "https://babydocamreen.com";

export const DOCTOR = {
  // Her name on record is "Dr. Amreen" only. Hamza is her father's name
  // (SM Hamza) and is used as a surname on Facebook, not on record.
  // Do not add a surname anywhere on this site.
  name: "Dr. Amreen",
  shortName: "Dr. Amreen",
  speciality: "Pediatrician",
  // Printed exactly as supplied. Do not expand, reorder or embellish.
  qualifications: "MBBS, MD Pediatrics, FAGE",
  degrees: [
    { degree: "MBBS", institution: "Gandhi Medical College, Hyderabad" },
    {
      degree: "MD Pediatrics",
      institution: "Osmania Medical College / Niloufer Hospital, Hyderabad",
    },
    {
      degree: "FAGE",
      institution:
        "Fellow, Academy of General Education, Manipal",
    },
  ],
  registration: "TSMC/FMR/04064",
  registrationCouncil: "Telangana State Medical Council",
  honour: "Gold medallist",
  consultationFee: 500,
};

export const CLINIC = {
  name: "Caspian Healthcare",
  // Printed exactly as Dr. Khizer gave it. Do not add a floor, a unit or a
  // building name, and do not "correct" the spelling of Vijaynagar.
  addressLine1: "10-3-761/8, Opp. Post Office",
  addressLine2: "Vijaynagar Colony",
  city: "Hyderabad",
  state: "Telangana",
  postalCode: "500057",
  country: "IN",
  phone: "8919341154",
  phoneE164: "+918919341154",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Caspian+Healthcare+Vijaynagar+Colony+Hyderabad+500057",
  website: "https://caspianhealthcare.in",
};

export const OPD = {
  days: "Monday to Saturday",
  hours: "3:00 pm – 9:00 pm",
  closed: "Sunday closed",
  // schema.org opening hours
  schema: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "15:00",
      closes: "21:00",
    },
  ],
};

// Clean booking link. The old one carried a broken placeholder
// tracking tag (utm_source=%2Fclinic%2F%5Bclinicslug%5D).
export const BOOKING_URL =
  "https://www.eka.care/doctor/dr-amreen-pediatrician?cid=68032f8d25be81001d3d562e&utm_source=dramreen-site&utm_medium=website&utm_campaign=book-appointment";

// Her own Google Business Profile ("Dr. Amreen MD"), found by place ID on
// 4 Oct 2026. Not the Eka Care page, and not the Caspian Healthcare listing.
export const GOOGLE_PLACE_ID = "ChIJK6GsYSOXyzsRfX7Sjd_t10E";
export const GOOGLE_REVIEWS_URL = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`;
export const GOOGLE_WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;

// Her book. Details taken from the Amazon listing, printed as published.
export const BOOK = {
  title: "Dear Mama",
  subtitle: "The Fourth Trimester",
  strapline:
    "Navigating motherhood with a pediatrician and mom of 3 by your side",
  author: "Dr. Amreen",
  publisher: "Notion Press",
  published: "29 November 2025",
  pages: 116,
  isbn: "979-8901366028",
  cover: "/assets/images/clinic/dear-mama-cover.jpg",
  amazonUrl: "https://www.amazon.in/dp/B0G4H7ZK75",
  // Publisher's description, quoted from the listing.
  blurb:
    "As mothers, what we most need in the thick of it is guidance that feels like beloved companionship: steady, reassuring, and grounded in real understanding. This book tries to do just that.",
};

// @babydoc.amreen is her main Instagram: 92k followers, confirmed by Dr. Khizer
// on 4 Oct 2026. The older @yourdramreen account is not listed.
// yourdramreen.com and the YouTube channel on her Linktree are both dead.
export const SOCIAL = [
  {
    label: "Instagram",
    handle: "@babydoc.amreen",
    url: "https://www.instagram.com/babydoc.amreen/",
  },
  {
    label: "Facebook",
    handle: "Dr. Amreen",
    url: "https://www.facebook.com/YourDrAmreen",
  },
  {
    label: "LinkedIn",
    handle: "yourdramreen",
    url: "https://www.linkedin.com/in/yourdramreen",
  },
  {
    label: "X",
    handle: "@YourDrAmreen",
    url: "https://twitter.com/YourDrAmreen",
  },
];

export const INSTAGRAM = {
  handle: "@babydoc.amreen",
  url: "https://www.instagram.com/babydoc.amreen/",
  // Rounded figure as he gave it on 4 Oct 2026. Update by hand when it moves.
  followers: "92,000",
  // Her own bio line, word for word.
  bio: "Helping you raise healthy, happy kids",
};

// Reels shown on the site. Titles are our own short labels; the videos are
// hers and play from Instagram only when a visitor taps to load them.
export const REELS = [
  { id: "DWyLCw2koaU", title: "Why teething necklaces are not safe for babies" },
  { id: "DLSFqdqpWkJ", title: "Why the bottle should stop at two" },
  { id: "DdwJfaMyx4M", title: "A dark neck in children is not always dirt" },
  { id: "DdtlEqXSUM3", title: "Your baby does not need powder" },
];
export const REEL_FOR_MOTHERS = {
  id: "DR1inIuEuxs",
  title: "For every mama who has felt invisible: a reading from Dear Mama",
};

// WhatsApp vaccine reminders from the planner on /vaccination-guide.
// Needs the public.amreen_vaccine_reminders table in Supabase. While false,
// the planner offers the calendar download only and stores nothing.
export const VACCINE_REMINDERS_ENABLED = false;

export const SUPABASE = {
  url: "https://grxgmheazdfcbortpygr.supabase.co",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyeGdtaGVhemRmY2JvcnRweWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxODI0ODQsImV4cCI6MjEwNDc1ODQ4NH0.UXAotFHAhYPT7SJdq6D5C49v2SOh0889wneQIqzepmI",
  table: "amreen_enquiries",
  listFunction: "amreen_enquiries_list",
};

export const addressOneLine = [
  CLINIC.addressLine1,
  CLINIC.addressLine2,
  `${CLINIC.city} ${CLINIC.postalCode}`,
  CLINIC.state,
].join(", ");

// Caspian Healthcare does not yet run a paediatric inpatient ward or a
// paediatric emergency. Nothing on this site may imply that it does.
export const HAS_PAEDIATRIC_INPATIENT = false;
