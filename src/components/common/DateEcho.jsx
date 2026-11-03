import React from "react";

// Shows a picked date back in words ("3 November 2026"), so a parent whose
// phone shows the date field in month/day order cannot misread 11/03 as
// 11 March. Renders nothing until a valid yyyy-mm-dd value is set.
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DateEcho = ({ value }) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!m) return null;
  const month = MONTHS[Number(m[2]) - 1];
  if (!month) return null;
  return (
    <span className="date-echo" aria-live="polite">
      {Number(m[3])} {month} {m[1]}
    </span>
  );
};

export default DateEcho;
