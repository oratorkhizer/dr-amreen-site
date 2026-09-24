import React from "react";
import { NavLink } from "react-router-dom";
import { DOCTOR, CLINIC, OPD, BOOKING_URL } from "../data/site";
import "../styles/Appointment.css";

const STEPS = [
  {
    number: "01",
    title: "Pick a slot online",
    text: "Choose a date and time from the live OPD calendar. It takes under a minute and needs only your mobile number.",
  },
  {
    number: "02",
    title: "Get a confirmation",
    text: "You receive a confirmation on your mobile with the time and the clinic address.",
  },
  {
    number: "03",
    title: "Come at your time",
    text: "Reach the clinic a few minutes early and tell reception the name the booking is under. Your turn is held for you.",
  },
];

const BRING = [
  "Your child's vaccination card",
  "Any previous prescriptions, discharge summaries or reports",
  "A list of the medicines your child is taking now",
  "Your questions, written down, so nothing is forgotten",
];

const Appointment = () => {
  return (
    <main className="appointment-page" id="main-content">
      <section className="appointment-hero">
        <div className="appointment-container">
          <span className="appointment-eyebrow">Appointments</span>

          <h1 className="appointment-title">
            Book your child's visit
            <span className="appointment-title-accent">in under a minute.</span>
          </h1>

          <p className="appointment-intro">
            {DOCTOR.name} consults at {CLINIC.name}, Vijaynagar Colony,
            Hyderabad. Appointments are booked online so that your turn is held
            and you are not waiting with an unwell child.
          </p>

          <a
            className="appointment-primary-button"
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Book an Appointment</span>
            <span aria-hidden="true">↗</span>
          </a>

          <p className="appointment-note">
            Appointments are not given over the phone. Reception will send you
            this same link.
          </p>
        </div>
      </section>

      <section className="appointment-facts">
        <div className="appointment-container appointment-facts-grid">
          <div className="appointment-fact">
            <span className="appointment-fact-label">OPD timings</span>
            <strong className="appointment-fact-value">{OPD.hours}</strong>
            <span className="appointment-fact-note">
              {OPD.days}. {OPD.closed}.
            </span>
          </div>

          <div className="appointment-fact">
            <span className="appointment-fact-label">Consultation</span>
            <strong className="appointment-fact-value">
              Rs {DOCTOR.consultationFee}
            </strong>
            <span className="appointment-fact-note">
              Payable at the clinic reception.
            </span>
          </div>

          <div className="appointment-fact">
            <span className="appointment-fact-label">Clinic</span>
            <strong className="appointment-fact-value">{CLINIC.name}</strong>
            <span className="appointment-fact-note">
              {CLINIC.addressLine1}, {CLINIC.addressLine2},{" "}
              {CLINIC.city} {CLINIC.postalCode}
            </span>
          </div>

          <div className="appointment-fact">
            <span className="appointment-fact-label">Reception</span>
            <strong className="appointment-fact-value">
              <a href={`tel:${CLINIC.phoneE164}`}>{CLINIC.phone}</a>
            </strong>
            <span className="appointment-fact-note">
              For directions, reports and general help.
            </span>
          </div>
        </div>
      </section>

      <section className="appointment-steps">
        <div className="appointment-container">
          <h2 className="appointment-section-title">How it works</h2>

          <div className="appointment-steps-grid">
            {STEPS.map((step) => (
              <article className="appointment-step" key={step.number}>
                <span className="appointment-step-number">{step.number}</span>
                <h3 className="appointment-step-title">{step.title}</h3>
                <p className="appointment-step-text">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="appointment-bring">
        <div className="appointment-container appointment-bring-inner">
          <div>
            <h2 className="appointment-section-title">
              What to bring with you
            </h2>

            <ul className="appointment-bring-list">
              {BRING.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="appointment-urgent">
            <h2 className="appointment-urgent-title">If your child is unwell today</h2>

            <p>
              During OPD hours, do not wait for a slot. Come to {CLINIC.name},
              or call reception on{" "}
              <a href={`tel:${CLINIC.phoneE164}`}>{CLINIC.phone}</a>.
            </p>

            <p>
              Outside OPD hours, or if your child needs emergency care or
              admission, please go straight to the nearest hospital with a
              children's emergency department. {CLINIC.name} does not run a
              paediatric emergency or an inpatient ward for children.
            </p>

            <NavLink className="appointment-urgent-link" to="/contact">
              Clinic address and directions →
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Appointment;
