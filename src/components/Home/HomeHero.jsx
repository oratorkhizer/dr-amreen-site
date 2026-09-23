import React from "react";
import { NavLink } from "react-router-dom";
import { DOCTOR, CLINIC, OPD } from "../../data/site";
import "../../styles/Home/HomeHero.css";

const HomeHero = () => {
  return (
    <section className="home-hero">
      <div className="home-hero-container">
        <div className="home-hero-content">
          <div className="home-hero-eyebrow">
            <span className="home-hero-eyebrow-dot"></span>

            <span className="home-hero-eyebrow-text">
              Compassionate Pediatric Care
            </span>
          </div>

          <h1 className="home-hero-title">
            Little smiles deserve
            <span className="home-hero-title-highlight">gentle care.</span>
          </h1>

          <p className="home-hero-description">
            Pediatric care at Caspian Healthcare, Hyderabad. Newborn checks,
            growth and development, immunisation and childhood illness, from the
            first days through every stage of childhood.
          </p>

          <div className="home-hero-actions">
            <NavLink to="/appointment" className="home-hero-primary-button">
              <span className="home-hero-primary-button-text">
                Book an Appointment
              </span>

              <span className="home-hero-primary-button-arrow">→</span>
            </NavLink>

            <NavLink to="/about" className="home-hero-secondary-button">
              Meet Dr. Amreen
            </NavLink>
          </div>

          <div className="home-hero-trust">
            <div className="home-hero-trust-avatars">
              <span className="home-hero-trust-avatar">+</span>

              <span className="home-hero-trust-avatar">♡</span>

              <span className="home-hero-trust-avatar">✓</span>
            </div>

            <div className="home-hero-trust-content">
              <strong className="home-hero-trust-title">
                {DOCTOR.name}, {DOCTOR.qualifications}
              </strong>

              <span className="home-hero-trust-text">
                {CLINIC.name}, Vijaya Nagar Colony, {CLINIC.city}. Consultation Rs{" "}
                {DOCTOR.consultationFee}.
              </span>
            </div>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-hero-visual-background"></div>

          <div className="home-hero-orbit home-hero-orbit-one"></div>

          <div className="home-hero-orbit home-hero-orbit-two"></div>

          <div className="home-hero-image-wrapper">
            <img
              className="home-hero-image"
              src="/assets/images/clinic/dr-amreen-hero.jpg"
              srcSet="/assets/images/clinic/dr-amreen-hero.jpg 840w, /assets/images/clinic/dr-amreen-hero-small.jpg 460w"
              sizes="(max-width: 950px) 92vw, 540px"
              width="840"
              height="1029"
              alt={`${DOCTOR.name}, ${DOCTOR.speciality} at ${CLINIC.name}, Hyderabad`}
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="home-hero-floating-card home-hero-floating-card-top">
            <div className="home-hero-floating-icon">♡</div>

            <div className="home-hero-floating-content">
              <span className="home-hero-floating-label">Child First</span>

              <strong className="home-hero-floating-title">
                Gentle & Caring
              </strong>
            </div>
          </div>

          <div className="home-hero-floating-card home-hero-floating-card-bottom">
            <div className="home-hero-floating-icon home-hero-floating-icon-mint">
              ✓
            </div>

            <div className="home-hero-floating-content">
              <span className="home-hero-floating-label">OPD timings</span>

              <strong className="home-hero-floating-title">
                {OPD.days}, {OPD.hours}
              </strong>
            </div>
          </div>

          <span className="home-hero-decoration home-hero-decoration-one"></span>
          <span className="home-hero-decoration home-hero-decoration-two"></span>
          <span className="home-hero-decoration home-hero-decoration-three"></span>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
