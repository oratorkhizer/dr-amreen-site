import React from "react";
import CareIcon from "../components/common/CareIcon";
import { NavLink } from "react-router-dom";
import "../styles/PediatricCare.css";

const PediatricCare = () => {
  const pediatricCareAreas = [
    {
      number: "01",
      title: "Newborn Care",
      text: "Support and guidance during the important early weeks of your baby's life, including feeding, growth and general wellbeing.",
    },
    {
      number: "02",
      title: "Growth & Development",
      text: "Regular assessment of physical growth and developmental milestones as your child grows.",
    },
    {
      number: "03",
      title: "Childhood Illness",
      text: "Assessment and care for common childhood illnesses, with clear guidance for parents.",
    },
    {
      number: "04",
      title: "Nutrition",
      text: "Practical guidance around healthy eating, nutrition and age-appropriate dietary needs.",
    },
    {
      number: "05",
      title: "Vaccination",
      text: "Guidance on routine childhood immunisation and keeping vaccinations on schedule.",
    },
    {
      number: "06",
      title: "Adolescent Care",
      text: "Support for the changing health and developmental needs of growing children and adolescents.",
    },
  ];

  const pediatricCareStages = [
    {
      age: "01",
      stage: "Newborn",
      description: "Early care, feeding, growth and parental guidance.",
    },
    {
      age: "02",
      stage: "Infancy",
      description:
        "Growth monitoring, nutrition, development and immunisation.",
    },
    {
      age: "03",
      stage: "Early Childhood",
      description: "Development, nutrition, illnesses and preventive care.",
    },
    {
      age: "04",
      stage: "School Age",
      description:
        "Healthy growth, immunity, nutrition and common childhood concerns.",
    },
    {
      age: "05",
      stage: "Adolescence",
      description:
        "Health support through the physical and developmental changes of adolescence.",
    },
  ];

  return (
    <main className="pediatric-care-page" id="main-content">
      <section className="pediatric-care-hero">
        <div className="pediatric-care-hero-container">
          <div className="pediatric-care-hero-content">
            <span className="pediatric-care-hero-eyebrow">Pediatric Care</span>

            <h1 className="pediatric-care-hero-title">
              Pediatric care at
              <span>Caspian Healthcare.</span>
            </h1>

            <p className="pediatric-care-hero-description">
              Thoughtful pediatric care focused on your child's health,
              development and wellbeing, with parents kept informed at every
              step.
            </p>

            <div className="pediatric-care-hero-actions">
              <a
                href="https://www.eka.care/doctor/dr-amreen-pediatrician?cid=68032f8d25be81001d3d562e&utm_source=%2Fclinic%2F%5Bclinicslug%5D&utm_medium=eka-web&utm_campaign=web-navigation"
                target="_blank"
                rel="noopener noreferrer"
                className="pediatric-care-primary-button"
              >
                Book Appointment
                <span>→</span>
              </a>

              <a
                href="#pediatric-care-areas"
                className="pediatric-care-secondary-button"
              >
                Explore Care
                <span>↓</span>
              </a>
            </div>
          </div>

          <div className="pediatric-care-hero-visual">
            <div className="pediatric-care-hero-image-main">
              <img
                src="/assets/images/clinic/dr-amreen-portrait.jpg"
                alt="Dr. Amreen at her consulting room at Caspian Healthcare, Hyderabad"
                width="900"
                height="713"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="pediatric-care-hero-image-small">
              <img
                src="/assets/images/clinic/clinic-team.jpg"
                alt="The team at Caspian Healthcare, Hyderabad"
                width="1200"
                height="807"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="pediatric-care-hero-note">
              <span className="pediatric-care-hero-note-icon">♡</span>

              <div>
                <strong>Little patients.</strong>
                <span>Big care.</span>
              </div>
            </div>

            <span className="pediatric-care-hero-shape pediatric-care-hero-shape-one"></span>
            <span className="pediatric-care-hero-shape pediatric-care-hero-shape-two"></span>
          </div>
        </div>
      </section>

      <section className="pediatric-care-introduction">
        <div className="pediatric-care-introduction-container">
          <div className="pediatric-care-introduction-label">
            <span>01</span>
            Our Approach
          </div>

          <div className="pediatric-care-introduction-content">
            <h2>
              Care that looks at
              <span>the whole child.</span>
            </h2>

            <p>
              Pediatric care is about more than treating an illness. It is about
              understanding a child's growth, development, nutrition, immunity
              and everyday wellbeing while giving parents the confidence to make
              informed decisions.
            </p>

            <p>
              Dr. Amreen's approach focuses on listening carefully, assessing
              each child individually and explaining care in a way that parents
              can understand.
            </p>
          </div>

          <div className="pediatric-care-introduction-image">
            <CareIcon name="growth" className="care-icon-soft" />
          </div>
        </div>
      </section>

      <section className="pediatric-care-areas" id="pediatric-care-areas">
        <div className="pediatric-care-areas-container">
          <div className="pediatric-care-areas-heading">
            <div>
              <span className="pediatric-care-section-eyebrow">
                Areas of Care
              </span>

              <h2>
                Support for every
                <span>stage of childhood.</span>
              </h2>
            </div>

            <p>
              From the earliest days of life through adolescence, pediatric care
              changes with your child's needs.
            </p>
          </div>

          <div className="pediatric-care-areas-grid">
            {pediatricCareAreas.map((area) => (
              <article className="pediatric-care-area-card" key={area.number}>
                <span className="pediatric-care-area-number">
                  {area.number}
                </span>

                <div className="pediatric-care-area-icon">+</div>

                <h3>{area.title}</h3>

                <p>{area.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pediatric-care-stages">
        <div className="pediatric-care-stages-container">
          <div className="pediatric-care-stages-visual">
            <CareIcon name="growth" className="care-icon-soft" />

            <div className="pediatric-care-stages-badge">
              <span>Healthy</span>
              <strong>Growth</strong>
              <small>starts with good care.</small>
            </div>
          </div>

          <div className="pediatric-care-stages-content">
            <span className="pediatric-care-section-eyebrow">Growing Up</span>

            <h2>
              Different ages.
              <span>Different needs.</span>
            </h2>

            <p className="pediatric-care-stages-intro">
              Every stage of childhood brings new questions and new health
              needs. Regular pediatric care helps parents understand what to
              expect and when additional attention may be needed.
            </p>

            <div className="pediatric-care-stages-list">
              {pediatricCareStages.map((stage) => (
                <div className="pediatric-care-stage" key={stage.age}>
                  <span className="pediatric-care-stage-number">
                    {stage.age}
                  </span>

                  <div className="pediatric-care-stage-content">
                    <h3>{stage.stage}</h3>
                    <p>{stage.description}</p>
                  </div>

                  <span className="pediatric-care-stage-arrow">↗</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pediatric-care-prevention">
        <div className="pediatric-care-prevention-container">
          <div className="pediatric-care-prevention-heading">
            <span className="pediatric-care-section-eyebrow">
              Preventive Care
            </span>

            <h2>
              Keeping children
              <span>healthy before problems begin.</span>
            </h2>
          </div>

          <div className="pediatric-care-prevention-layout">
            <div className="pediatric-care-prevention-image">
              <CareIcon name="listen" className="care-icon-soft" />
            </div>

            <div className="pediatric-care-prevention-list">
              <div className="pediatric-care-prevention-item">
                <span>01</span>
                <div>
                  <h3>Routine Checkups</h3>
                  <p>
                    Regular assessment helps monitor your child's growth,
                    development and general health.
                  </p>
                </div>
              </div>

              <div className="pediatric-care-prevention-item">
                <span>02</span>
                <div>
                  <h3>Immunisation</h3>
                  <p>
                    Staying up to date with recommended childhood vaccinations
                    is an important part of preventive care.
                  </p>
                </div>
              </div>

              <div className="pediatric-care-prevention-item">
                <span>03</span>
                <div>
                  <h3>Nutrition Guidance</h3>
                  <p>
                    Age-appropriate nutrition supports healthy growth,
                    development and everyday wellbeing.
                  </p>
                </div>
              </div>

              <div className="pediatric-care-prevention-item">
                <span>04</span>
                <div>
                  <h3>Development Monitoring</h3>
                  <p>
                    Understanding developmental milestones helps parents
                    recognise their child's progress and concerns early.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pediatric-care-cta">
        <div className="pediatric-care-cta-container">
          <div className="pediatric-care-cta-image">
            <CareIcon name="adolescent" className="care-icon-soft" />
          </div>

          <div className="pediatric-care-cta-content">
            <span className="pediatric-care-section-eyebrow">
              Your Child's Health
            </span>

            <h2>
              When you have questions,
              <span>we're here to help.</span>
            </h2>

            <p>
              If you have concerns about your child's health, growth,
              development or wellbeing, schedule a consultation with Dr. Amreen.
            </p>

            <a
              href="https://www.eka.care/doctor/dr-amreen-pediatrician?cid=68032f8d25be81001d3d562e&utm_source=%2Fclinic%2F%5Bclinicslug%5D&utm_medium=eka-web&utm_campaign=web-navigation"
              target="_blank"
              rel="noopener noreferrer"
              className="pediatric-care-cta-button"
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

export default PediatricCare;
