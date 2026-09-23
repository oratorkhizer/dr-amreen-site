import React from "react";

// Simple line icons drawn in the brand colour. They replace the stock
// photographs on the small cards: the photographs were mismatched to their
// labels and together weighed about 18 MB.

const PATHS = {
  newborn: (
    <>
      <circle cx="24" cy="20" r="11" />
      <circle cx="20" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="28" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <path d="M21 24.5c1.8 1.5 4.2 1.5 6 0" />
      <path d="M16 12c1.5-2.5 4.5-4 8-4s6.5 1.5 8 4" />
      <path d="M13 34c3-2 7-3 11-3s8 1 11 3" />
      <path d="M16 40h16" />
    </>
  ),
  growth: (
    <>
      <path d="M10 38h28" />
      <path d="M16 38V26" />
      <path d="M24 38V18" />
      <path d="M32 38V10" />
      <circle cx="16" cy="23" r="2.5" />
      <circle cx="24" cy="15" r="2.5" />
      <circle cx="32" cy="7.5" r="2.5" />
    </>
  ),
  vaccination: (
    <>
      <path d="M28 10l10 10" />
      <path d="M31.5 13.5l-13 13-4.5 1.5-1.5 4.5-3 3" />
      <path d="M22 17l9 9" />
      <path d="M18 21l9 9" />
    </>
  ),
  illness: (
    <>
      <path d="M27 10a3 3 0 0 0-6 0v18a6 6 0 1 0 6 0V10z" />
      <circle cx="24" cy="34" r="3.5" fill="currentColor" stroke="none" />
      <path d="M24 31V18" />
      <path d="M31 14h5M31 20h4M31 26h5" />
    </>
  ),
  nutrition: (
    <>
      <path d="M14 8v12a4 4 0 0 0 8 0V8" />
      <path d="M18 8v32" />
      <path d="M34 8c-3 3-4 7-4 11s1 6 4 6" />
      <path d="M34 8v32" />
    </>
  ),
  adolescent: (
    <>
      <circle cx="24" cy="15" r="6" />
      <path d="M12 40c0-6.6 5.4-12 12-12s12 5.4 12 12" />
      <path d="M17 33l-3 7M31 33l3 7" />
    </>
  ),
  heart: (
    <>
      <path d="M24 38S10 30 10 20a7 7 0 0 1 14-3 7 7 0 0 1 14 3c0 10-14 18-14 18z" />
    </>
  ),
  listen: (
    <>
      <path d="M14 10v10a10 10 0 0 0 20 0V10" />
      <circle cx="34" cy="30" r="5" />
      <path d="M24 30v-0.5" />
      <path d="M14 10h4M30 10h4" />
    </>
  ),
};

const CareIcon = ({ name = "heart", className = "" }) => (
  <span className={`care-icon ${className}`} aria-hidden="true">
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name] || PATHS.heart}
    </svg>
  </span>
);

export default CareIcon;
