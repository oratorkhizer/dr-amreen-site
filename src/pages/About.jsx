import React from "react";
import { DOCTOR, CLINIC, OPD, BOOK, BOOKING_URL } from "../data/site";
import { NavLink } from "react-router-dom";
import "../styles/About.css";

const About = () => {
  return (
    <main className="about-page" id="main-content">
      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero-content">
            <span className="about-eyebrow">About Dr. Amreen</span>

            <h1 className="about-hero-title">
              A children's doctor
              <span> who is a mother too.</span>
            </h1>

            <p className="about-hero-description">
              Gold medallist from Niloufer Hospital, author of {BOOK.title},
              and a mother of three. She sees children from the first week of
              life to the teenage years at {CLINIC.name}, Hyderabad.
            </p>

            <div className="about-hero-actions">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="about-primary-button"
              >
                Book a visit
                <span>→</span>
              </a>

              <a href="#about-doctor" className="about-secondary-button">
                Meet Dr. Amreen
              </a>
            </div>
          </div>

          <div className="about-hero-visual">
            <div className="about-hero-image-wrapper">
              <img
                src="/assets/images/clinic/dr-amreen-portrait.jpg"
                alt="Dr. Amreen at her clinic at Caspian Healthcare, Hyderabad"
                width="760"
                height="789"
                loading="lazy"
                decoding="async" className="about-hero-image"
              />
            </div>

            <div className="about-hero-badge">
              <span className="about-hero-badge-number">3</span>
              <div>
                <strong>Mother of three</strong>
                <span>and author of {BOOK.title}.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="about-introduction" id="about-doctor">
        <div className="about-container">
          <div className="about-introduction-grid">
            <div className="about-section-label">
              <span>01</span>
              <p>Meet Dr. Amreen</p>
            </div>

            <div className="about-introduction-content">
              <span className="about-eyebrow">A pediatrician who listens</span>

              <h2 className="about-section-title">
                Trained at Niloufer,
                <span> taught by three children.</span>
              </h2>

              <p>
                Dr. Amreen did her MD in Pediatrics at Niloufer Hospital,
                Hyderabad's government hospital for women and children, and
                finished as a gold medallist. Her MBBS is from Gandhi Medical
                College.
              </p>

              <p>
                Raising three children of her own taught her the rest: what
                parents actually worry about at home, and how much a clear
                answer helps. That is why her advice is practical,
                and why she takes time to explain.
              </p>

              <p>
                She writes for parents too. Her book {BOOK.title} is for
                mothers in the first months after birth, and her short videos on
                Instagram answer the questions that come up at home. She
                consults in English, Hindi, Urdu and Telugu.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-philosophy">
        <div className="about-container">
          <div className="about-philosophy-grid">
            <div className="about-philosophy-image-wrapper">
              <img
                src="/assets/images/clinic/dr-amreen-hero.jpg"
                alt="Dr. Amreen, Pediatrician"
                width="840"
                height="1029"
                loading="lazy"
                decoding="async" className="about-philosophy-image"
              />
            </div>

            <div className="about-philosophy-content">
              <span className="about-eyebrow">The approach</span>

              <h2 className="about-section-title">
                What a visit
                <span> with her is like.</span>
              </h2>

              <p>
                She examines the child properly, tells you what she found, and
                tells you what to watch for at home.
              </p>

              <div className="about-values">
                <div className="about-value">
                  <span className="about-value-number">01</span>
                  <div>
                    <h3>Listen</h3>
                    <p>
                      Your questions first. Bring them written down; there
                      are no silly ones.
                    </p>
                  </div>
                </div>

                <div className="about-value">
                  <span className="about-value-number">02</span>
                  <div>
                    <h3>Explain</h3>
                    <p>
                      What is wrong, what is not, and what the treatment is
                      for, in plain words.
                    </p>
                  </div>
                </div>

                <div className="about-value">
                  <span className="about-value-number">03</span>
                  <div>
                    <h3>Follow up</h3>
                    <p>
                      Growth plotted and vaccines tracked, so nothing is missed
                      at the next visit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-expertise">
        <div className="about-container">
          <div className="about-expertise-header">
            <div>
              <span className="about-eyebrow">Where to next</span>

              <h2 className="about-section-title">
                More from
                <span> Dr. Amreen.</span>
              </h2>
            </div>
          </div>

          <div className="about-expertise-grid about-next-grid">
            <NavLink to="/pediatric-care" className="about-expertise-card about-next-card">
              <span>01</span>
              <h3>What she treats <span aria-hidden="true">→</span></h3>
              <p>Newborns, growth, vaccines, illnesses and adolescent health.</p>
            </NavLink>

            <NavLink to="/child-health" className="about-expertise-card about-next-card">
              <span>02</span>
              <h3>Guides for parents <span aria-hidden="true">→</span></h3>
              <p>Newborn care, vaccine dates, growth charts, feeding and illnesses.</p>
            </NavLink>

            <NavLink to="/new-mothers" className="about-expertise-card about-next-card">
              <span>03</span>
              <h3>For new mothers <span aria-hidden="true">→</span></h3>
              <p>Meet your baby's doctor before the birth, and read about her book.</p>
            </NavLink>
          </div>
        </div>
      </section>

      <section className="about-credentials">
        <div className="about-container">
          <div className="about-credentials-inner">
            <div className="about-credentials-content">
              <span className="about-eyebrow">Professional profile</span>

              <h2 className="about-section-title">
                Training and
                <span> registration.</span>
              </h2>

              <p>
                {DOCTOR.name} is a {DOCTOR.speciality.toLowerCase()} at{" "}
                {CLINIC.name}, Vijaynagar Colony, Hyderabad. She took her MBBS
                at Gandhi Medical College and her MD in Pediatrics at Osmania
                Medical College and Niloufer Hospital, where she was a gold
                medallist. She is a Fellow of the Academy of General Education,
                Manipal, and is registered with the {DOCTOR.registrationCouncil}.
              </p>

              <p>
                Her OPD runs {OPD.days}, {OPD.hours}. Consultations are by
                appointment, booked online.
              </p>

              <p>
                She is the author of{" "}
                <a
                  className="about-book-link"
                  href={BOOK.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {BOOK.title}: {BOOK.subtitle}
                </a>
                , a book for new mothers on the first months after birth,
                published by {BOOK.publisher} in 2025.
              </p>
            </div>

            <div className="about-credentials-list">
              {DOCTOR.degrees.map((item) => (
                <div className="about-credential-item" key={item.degree}>
                  <span>{item.institution}</span>
                  <strong>{item.degree}</strong>
                </div>
              ))}

              <div className="about-credential-item">
                <span>Speciality</span>
                <strong>Pediatrics</strong>
              </div>

              <div className="about-credential-item">
                <span>Recognition</span>
                <strong>{DOCTOR.honour}</strong>
              </div>

              <div className="about-credential-item">
                <span>Medical council registration</span>
                <strong>{DOCTOR.registration}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-container">
          <div className="about-cta-inner">
            <span className="about-eyebrow">Your child's health matters</span>

            <h2>
              Book a visit
              <span> with Dr. Amreen.</span>
            </h2>

            <p>
              {OPD.days}, {OPD.hours}, at {CLINIC.name}, Vijaynagar Colony.
              Consultation Rs {DOCTOR.consultationFee}.
            </p>

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="about-cta-button"
            >
              Book a visit
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
