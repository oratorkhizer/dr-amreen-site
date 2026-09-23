import React from "react";
import { DOCTOR, CLINIC, OPD } from "../data/site";
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
              Caring for children with
              <span> knowledge, patience & heart.</span>
            </h1>

            <p className="about-hero-description">
              A warm and child-focused approach to pediatric care, helping
              children grow healthy while giving parents confidence and peace of
              mind.
            </p>

            <div className="about-hero-actions">
              <a
                href="https://www.eka.care/doctor/dr-amreen-pediatrician?cid=68032f8d25be81001d3d562e&utm_source=%2Fclinic%2F%5Bclinicslug%5D&utm_medium=eka-web&utm_campaign=web-navigation"
                target="_blank"
                rel="noopener noreferrer"
                className="about-primary-button"
              >
                Book an Appointment
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
              <span className="about-hero-badge-number">01</span>
              <div>
                <strong>Dedicated to children</strong>
                <span>Every child matters.</span>
              </div>
            </div>

            <span className="about-decoration about-decoration-one"></span>
            <span className="about-decoration about-decoration-two"></span>
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
                Making every visit feel
                <span> a little easier.</span>
              </h2>

              <p>
                Dr. Amreen is dedicated to providing thoughtful, compassionate
                pediatric care in an environment where children feel comfortable
                and parents feel heard.
              </p>

              <p>
                Every child is different. Her approach focuses on understanding
                each child's individual needs while keeping parents informed
                throughout their child's care.
              </p>

              <p>
                From routine consultations to childhood illnesses, nutrition,
                development and preventive care, the goal is simple: to support
                children and their families at every stage of childhood.
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
                Care that begins with
                <span> understanding.</span>
              </h2>

              <p>
                Pediatric care is about more than treating an illness. It is
                about understanding the child, listening to the family and
                creating a comfortable experience for everyone.
              </p>

              <div className="about-values">
                <div className="about-value">
                  <span className="about-value-number">01</span>
                  <div>
                    <h3>Listen</h3>
                    <p>
                      Taking time to understand parents' concerns and children's
                      needs.
                    </p>
                  </div>
                </div>

                <div className="about-value">
                  <span className="about-value-number">02</span>
                  <div>
                    <h3>Explain</h3>
                    <p>
                      Making medical information easier for families to
                      understand.
                    </p>
                  </div>
                </div>

                <div className="about-value">
                  <span className="about-value-number">03</span>
                  <div>
                    <h3>Care</h3>
                    <p>
                      Providing thoughtful and compassionate pediatric care.
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
              <span className="about-eyebrow">Areas of care</span>

              <h2 className="about-section-title">
                Supporting children through
                <span> every stage.</span>
              </h2>
            </div>

            <p>
              From infancy through childhood, pediatric care covers many
              different stages of growth and development.
            </p>
          </div>

          <div className="about-expertise-grid">
            <article className="about-expertise-card">
              <span>01</span>
              <h3>Newborn Care</h3>
              <p>
                Guidance and support during the important first weeks of a
                baby's life.
              </p>
            </article>

            <article className="about-expertise-card">
              <span>02</span>
              <h3>Child Health</h3>
              <p>
                Supporting children's health through regular consultations and
                preventive care.
              </p>
            </article>

            <article className="about-expertise-card">
              <span>03</span>
              <h3>Nutrition</h3>
              <p>
                Helping parents understand healthy nutrition and eating habits
                during childhood.
              </p>
            </article>

            <article className="about-expertise-card">
              <span>04</span>
              <h3>Growth & Development</h3>
              <p>
                Monitoring important milestones and supporting healthy
                development.
              </p>
            </article>

            <article className="about-expertise-card">
              <span>05</span>
              <h3>Vaccination</h3>
              <p>
                Helping families understand childhood immunisation and
                vaccination schedules.
              </p>
            </article>

            <article className="about-expertise-card">
              <span>06</span>
              <h3>Childhood Illnesses</h3>
              <p>Assessment and care for common childhood health concerns.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-credentials">
        <div className="about-container">
          <div className="about-credentials-inner">
            <div className="about-credentials-content">
              <span className="about-eyebrow">Professional profile</span>

              <h2 className="about-section-title">
                Experience you can
                <span> feel confident in.</span>
              </h2>

              <p>
                {DOCTOR.name} is a {DOCTOR.speciality.toLowerCase()} at{" "}
                {CLINIC.name}, Vijaya Nagar Colony, Hyderabad. She took her MBBS
                at Gandhi Medical College and her MD in Pediatrics at Osmania
                Medical College and Niloufer Hospital, where she was a gold
                medallist. She is a Fellow of the Academy of General Education,
                Manipal, and is registered with the {DOCTOR.registrationCouncil}.
              </p>

              <p>
                Her OPD runs {OPD.days}, {OPD.hours}, and children who need
                admission can be admitted at {CLINIC.name}.
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
              Looking for thoughtful care
              <span> for your child?</span>
            </h2>

            <p>
              Book a consultation and take the next step towards understanding
              your child's health and wellbeing.
            </p>

            <a
              href="https://www.eka.care/doctor/dr-amreen-pediatrician?cid=68032f8d25be81001d3d562e&utm_source=%2Fclinic%2F%5Bclinicslug%5D&utm_medium=eka-web&utm_campaign=web-navigation"
              target="_blank"
              rel="noopener noreferrer"
              className="about-cta-button"
            >
              Book an Appointment
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
