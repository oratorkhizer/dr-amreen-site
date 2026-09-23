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
  addressLine1: "10-3-761/8, First Floor, Unit-2",
  addressLine2: "Ahmed Plaza, Vijaya Nagar Colony",
  landmark: "Opp. Post Office",
  city: "Hyderabad",
  state: "Telangana",
  postalCode: "500057",
  country: "IN",
  phone: "8919341154",
  phoneE164: "+918919341154",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Caspian+Healthcare+Vijaya+Nagar+Colony+Hyderabad",
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
  CLINIC.landmark,
  `${CLINIC.city} ${CLINIC.postalCode}`,
].join(", ");
