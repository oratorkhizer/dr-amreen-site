import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Home/HomeAppointment.css";

const HomeAppointment = () => {
  return (
    <section className="home-appointment">
      <div className="home-appointment-container">
        <div className="home-appointment-card">
          <div className="home-appointment-content">
            <span className="home-appointment-eyebrow">
              Your Child's Health Matters
            </span>

            <h2 className="home-appointment-title">
              A healthier childhood
              <span className="home-appointment-title-highlight">
                starts with a conversation.
              </span>
            </h2>

            <p className="home-appointment-description">
              Whether you have a health concern, need a routine check-up or
              simply want guidance about your child's growth, we're here to
              help.
            </p>

            <div className="home-appointment-actions">
              <NavLink
                to="/appointment"
                className="home-appointment-primary-button"
              >
                <span>Book an Appointment</span>

                <span className="home-appointment-primary-arrow">→</span>
              </NavLink>

              <NavLink
                to="/contact"
                className="home-appointment-secondary-button"
              >
                Contact Clinic
              </NavLink>
            </div>
          </div>

          <div className="home-appointment-visual">
            <div className="home-appointment-circle home-appointment-circle-large"></div>

            <div className="home-appointment-circle home-appointment-circle-medium"></div>

            <div className="home-appointment-circle home-appointment-circle-small"></div>

            <div className="home-appointment-icon">♡</div>

            <div className="home-appointment-floating-card">
              <span className="home-appointment-floating-icon">✓</span>

              <div className="home-appointment-floating-content">
                <strong>Child-focused</strong>

                <span>Care with compassion</span>
              </div>
            </div>

            <span className="home-appointment-decoration home-appointment-decoration-one"></span>

            <span className="home-appointment-decoration home-appointment-decoration-two"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAppointment;
