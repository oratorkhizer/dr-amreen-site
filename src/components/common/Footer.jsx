import React from "react";
import { NavLink } from "react-router-dom";
import {
  DOCTOR,
  CLINIC,
  OPD,
  BOOKING_URL,
  addressOneLine,
} from "../../data/site";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="site-footer-grid">
          <div className="site-footer-block">
            <span className="site-footer-name">{DOCTOR.name}</span>

            <span className="site-footer-speciality">
              {DOCTOR.qualifications}
            </span>

            <span className="site-footer-speciality">
              {DOCTOR.speciality} · {CLINIC.name}
            </span>

            <p className="site-footer-text">
              {DOCTOR.registrationCouncil} registration {DOCTOR.registration}
            </p>
          </div>

          <div className="site-footer-block">
            <h2 className="site-footer-heading">Clinic</h2>

            <address className="site-footer-address">
              {CLINIC.addressLine1}
              <br />
              {CLINIC.addressLine2}
              <br />
              {CLINIC.landmark}
              <br />
              {CLINIC.city} {CLINIC.postalCode}, {CLINIC.state}
            </address>

            <a
              className="site-footer-link"
              href={CLINIC.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </div>

          <div className="site-footer-block">
            <h2 className="site-footer-heading">OPD timings</h2>

            <p className="site-footer-text">
              {OPD.days}
              <br />
              {OPD.hours}
              <br />
              {OPD.closed}
            </p>

            <a className="site-footer-link" href={`tel:${CLINIC.phoneE164}`}>
              Call {CLINIC.phone}
            </a>

            <p className="site-footer-small">
              Appointments are booked online, not over the phone.
            </p>
          </div>

          <div className="site-footer-block">
            <h2 className="site-footer-heading">Pages</h2>

            <nav className="site-footer-navigation">
              <NavLink to="/about">About Dr. Amreen</NavLink>
              <NavLink to="/pediatric-care">Pediatric Care</NavLink>
              <NavLink to="/child-health">Child Health</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Book an Appointment
              </a>
            </nav>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p className="site-footer-small">
            © {new Date().getFullYear()} {DOCTOR.name}, {CLINIC.name}.{" "}
            {addressOneLine}.
          </p>

          <p className="site-footer-small">
            The information on this website is general guidance for parents. It
            does not replace a consultation. If your child is unwell, please see
            a doctor.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
