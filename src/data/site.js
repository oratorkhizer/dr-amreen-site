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

export const GOOGLE_REVIEWS_URL =
  "https://www.eka.care/doctor/dr-amreen-pediatrician";

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

// Verified live in September 2026. @babydoc.amreen is her current Instagram and
// matches this site's domain; the older @yourdramreen account is not listed.
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
// ============================================================
//  SINGLE SOURCE OF TRUTH FOR THE SITE
//  Change a detail here and it updates everywhere:
//  navbar, footer, contact page, schema.org data and meta tags.
// ============================================================

export const SITE_URL = "https://dramreen.caspianhealthcare.in";

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

export const GOOGLE_REVIEWS_URL =
  "https://www.eka.care/doctor/dr-amreen-pediatrician";

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

// Verified live in September 2026. yourdramreen.com and the YouTube channel
// on her Linktree are both dead, so they are deliberately not listed here.
export const SOCIAL = [
  {
    label: "Instagram",
    handle: "@yourdramreen",
    url: "https://www.instagram.com/yourdramreen/",
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
