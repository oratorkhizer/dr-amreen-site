import React from "react";
import { NavLink } from "react-router-dom";
import { DOCTOR, CLINIC, OPD, BOOKING_URL } from "../../data/site";
import "../../styles/Home/HomeClinic.css";

const HomeClinic = () => {
  return (
    <section className="home-clinic">
      <div className="home-clinic-container">
        <div className="home-clinic-header">
          <div className="home-clinic-heading">
            <span className="home-clinic-eyebrow">Visit The Clinic</span>

            <h2 className="home-clinic-title">
              A welcoming place
              <span className="home-clinic-title-highlight">
                for little ones.
              </span>
            </h2>
          </div>

          <p className="home-clinic-description">
            Good pediatric care begins with a comfortable environment. Find the
            clinic, plan your visit and get in touch with the team.
          </p>
        </div>

        <div className="home-clinic-content">
          <a
            className="home-clinic-map"
            href={CLINIC.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${CLINIC.name} in Google Maps`}
          >
            <div className="home-clinic-map-pattern" aria-hidden="true"></div>

            <div className="home-clinic-map-pin" aria-hidden="true">
              <span className="home-clinic-map-pin-icon">+</span>
            </div>

            <div className="home-clinic-map-label">
              <span className="home-clinic-map-label-small">{CLINIC.name}</span>

              <strong className="home-clinic-map-label-title">
                {CLINIC.addressLine2}
              </strong>

              <span className="home-clinic-map-label-small">
                {CLINIC.city} {CLINIC.postalCode}, {CLINIC.state}
              </span>
            </div>

            <span className="home-clinic-map-action">Open in Google Maps ↗</span>

            <div className="home-clinic-map-route home-clinic-map-route-one" aria-hidden="true"></div>
            <div className="home-clinic-map-route home-clinic-map-route-two" aria-hidden="true"></div>
            <div className="home-clinic-map-route home-clinic-map-route-three" aria-hidden="true"></div>
          </a>

          <div className="home-clinic-details">
            <div className="home-clinic-detail">
              <div className="home-clinic-detail-icon">+</div>

              <div className="home-clinic-detail-content">
                <span className="home-clinic-detail-label">
                  Clinic Location
                </span>

                <h3 className="home-clinic-detail-title">{CLINIC.name}</h3>

                <p className="home-clinic-detail-text">
                  {CLINIC.addressLine1}, {CLINIC.addressLine2},{" "}
                  {CLINIC.city} {CLINIC.postalCode}, {CLINIC.state}
                </p>
              </div>
            </div>

            <div className="home-clinic-detail">
              <div className="home-clinic-detail-icon home-clinic-detail-icon-mint">
                ♡
              </div>

              <div className="home-clinic-detail-content">
                <span className="home-clinic-detail-label">OPD timings</span>

                <h3 className="home-clinic-detail-title">
                  {OPD.days}, {OPD.hours}
                </h3>

                <p className="home-clinic-detail-text">
                  {OPD.closed}. Consultation Rs {DOCTOR.consultationFee}, payable
                  at reception.
                </p>
              </div>
            </div>

            <div className="home-clinic-detail">
              <div className="home-clinic-detail-icon home-clinic-detail-icon-sky">
                →
              </div>

              <div className="home-clinic-detail-content">
                <span className="home-clinic-detail-label">Reception</span>

                <h3 className="home-clinic-detail-title">
                  <a href={`tel:${CLINIC.phoneE164}`}>{CLINIC.phone}</a>
                </h3>

                <p className="home-clinic-detail-text">
                  For directions, reports and general enquiries. Appointments are
                  booked online.
                </p>
              </div>
            </div>

            <div className="home-clinic-actions">
              <NavLink to="/contact" className="home-clinic-primary-button">
                <span>Contact Clinic</span>

                <span className="home-clinic-primary-arrow">→</span>
              </NavLink>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="home-clinic-secondary-button"
              >
                Book Appointment
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeClinic;
