import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Home/HomeDoctor.css";

const HomeDoctor = () => {
  return (
    <section className="home-doctor">
      <div className="home-doctor-container">
        <div className="home-doctor-visual">
          <div className="home-doctor-image-wrapper">
            <img
                src="/assets/images/clinic/dr-amreen-portrait.jpg"
                alt="Dr. Amreen, Pediatrician at Caspian Healthcare, Hyderabad"
                width="900"
                height="713"
                loading="lazy"
                decoding="async" className="home-doctor-image"
              />
          </div>

          <div className="home-doctor-experience-card">
            <span className="home-doctor-experience-number">01</span>

            <div className="home-doctor-experience-content">
              <strong className="home-doctor-experience-title">
                Child First
              </strong>

              <span className="home-doctor-experience-text">
                Care that puts little ones first
              </span>
            </div>
          </div>

          <span className="home-doctor-decoration home-doctor-decoration-one"></span>
          <span className="home-doctor-decoration home-doctor-decoration-two"></span>
        </div>

        <div className="home-doctor-content">
          <span className="home-doctor-eyebrow">Meet Your Pediatrician</span>

          <h2 className="home-doctor-title">
            A doctor who cares for
            <span className="home-doctor-title-highlight">
              more than just symptoms.
            </span>
          </h2>

          <p className="home-doctor-description">
            Every child is different, and every little patient deserves care
            that understands them. Dr. Amreen believes in creating a
            comfortable, reassuring environment where children feel safe and
            parents feel heard.
          </p>

          <p className="home-doctor-description home-doctor-description-secondary">
            From routine check-ups and vaccinations to childhood illnesses and
            developmental concerns, the focus is always on thoughtful,
            compassionate pediatric care.
          </p>

          <div className="home-doctor-highlights">
            <div className="home-doctor-highlight">
              <span className="home-doctor-highlight-icon">✓</span>

              <span className="home-doctor-highlight-text">
                Child-centred approach
              </span>
            </div>

            <div className="home-doctor-highlight">
              <span className="home-doctor-highlight-icon">✓</span>

              <span className="home-doctor-highlight-text">
                Parent-friendly guidance
              </span>
            </div>

            <div className="home-doctor-highlight">
              <span className="home-doctor-highlight-icon">✓</span>

              <span className="home-doctor-highlight-text">
                Comprehensive pediatric care
              </span>
            </div>
          </div>

          <NavLink to="/about" className="home-doctor-button">
            <span>Know Dr. Amreen</span>

            <span className="home-doctor-button-arrow">→</span>
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default HomeDoctor;
