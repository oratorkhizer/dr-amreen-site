import React from "react";
import { BOOKING_URL, CLINIC } from "../../data/site";

// Phones only (CSS shows it under 760px): the three things a parent
// reaches for, always one tap away. Booking goes straight to Eka.
const PhoneBar = () => (
  <nav className="phone-bar" aria-label="Quick actions">
    <a className="phone-bar-book" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
      Book a visit
    </a>
    <a href={`tel:${CLINIC.phoneE164}`}>Call</a>
    <a href={CLINIC.mapsUrl} target="_blank" rel="noopener noreferrer">
      Directions
    </a>
  </nav>
);

export default PhoneBar;
