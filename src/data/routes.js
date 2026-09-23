// Per-route title, description and canonical path.
// Used by <Seo /> at runtime AND by scripts/build-routes.mjs at build
// time so that crawlers and WhatsApp previews get the right head tags
// without running JavaScript.

export const ROUTES = [
  {
    path: "/",
    title:
      "Dr. Amreen, Pediatrician in Hyderabad | Caspian Healthcare",
    description:
      "Dr. Amreen, MBBS MD Pediatrics, is a pediatrician at Caspian Healthcare, Vijaya Nagar Colony, Hyderabad. Newborn care, growth and development, immunisation and childhood illness. OPD Monday to Saturday, 3 pm to 9 pm.",
  },
  {
    path: "/about",
    title: "About Dr. Amreen, Pediatrician, Hyderabad",
    description:
      "Dr. Amreen, MBBS (Gandhi Medical College), MD Pediatrics (Osmania Medical College and Niloufer Hospital), FAGE Manipal. Gold medallist. Telangana State Medical Council registration TSMC/FMR/04064.",
  },
  {
    path: "/pediatric-care",
    title: "Pediatric Care at Caspian Healthcare, Hyderabad | Dr. Amreen",
    description:
      "What Dr. Amreen treats and how a consultation works: newborn checks, growth monitoring, immunisation, nutrition, childhood illness and adolescent health. Consultation Rs 500.",
  },
  {
    path: "/child-health",
    title: "Parent's Guide to Child Health | Dr. Amreen, Hyderabad",
    description:
      "Plain guidance for parents on newborn care, feeding, immunisation, growth milestones and common childhood illnesses, and when to bring your child in.",
  },
  {
    path: "/contact",
    title: "Contact and Clinic Address | Dr. Amreen, Hyderabad",
    description:
      "Caspian Healthcare, 10-3-761/8, First Floor, Unit-2, Ahmed Plaza, Vijaya Nagar Colony, Opp. Post Office, Hyderabad 500057. Phone 8919341154. OPD Monday to Saturday, 3 pm to 9 pm.",
  },
  {
    path: "/appointment",
    title: "Book an Appointment with Dr. Amreen, Hyderabad",
    description:
      "Appointments with Dr. Amreen are booked online. Pick a slot, get a confirmation, and walk in at your time. Consultation Rs 500. OPD Monday to Saturday, 3 pm to 9 pm.",
  },
  {
    path: "/newborn-care",
    title: "Newborn Care: A Guide for New Parents | Dr. Amreen",
    description:
      "Feeding, sleep, weight gain, jaundice, cord care and the danger signs that need a doctor the same day. Written for parents in the first six weeks.",
  },
  {
    path: "/child-nutrition",
    title: "Child Nutrition: Feeding by Age | Dr. Amreen",
    description:
      "Exclusive breastfeeding, starting solids at six months, iron and calcium, fussy eating and what to do about weight that is not picking up.",
  },
  {
    path: "/vaccination-guide",
    title: "Childhood Vaccination Guide | Dr. Amreen, Hyderabad",
    description:
      "Which vaccines are due at which age, what a missed dose means, normal reactions after a vaccine, and when to call the clinic.",
  },
  {
    path: "/growth-development",
    title: "Growth and Development Milestones | Dr. Amreen",
    description:
      "Height, weight and head circumference, and the movement, speech and social milestones to expect from birth to five years. When a delay needs assessment.",
  },
  {
    path: "/childhood-illnesses",
    title: "Common Childhood Illnesses | Dr. Amreen, Hyderabad",
    description:
      "Fever, cough and cold, loose motions, vomiting, ear pain and rashes. What usually settles at home and the warning signs that need a doctor now.",
  },
];

export const NOT_FOUND = {
  path: null,
  title: "Page not found | Dr. Amreen, Pediatrician, Hyderabad",
  description:
    "This page does not exist. Find Dr. Amreen's clinic address, OPD timings and booking link at Caspian Healthcare, Vijaya Nagar Colony, Hyderabad.",
};

export const routeMeta = (pathname) =>
  ROUTES.find((route) => route.path === pathname) || NOT_FOUND;
