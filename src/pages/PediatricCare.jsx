import React from "react";
import { BOOKING_URL } from "../data/site";
import { NavLink } from "react-router-dom";
import "../styles/PediatricCare.css";

const PediatricCare = () => {
  const pediatricCareAreas = [
    {
      number: "01",
      title: "Newborn care",
      text: "A first check in the first week: weight, feeding, jaundice and the cord. Then a visit at six weeks with the first vaccines.",
    },
    {
      number: "02",
      title: "Growth and development",
      text: "Weight, height and head size plotted on the growth chart at every visit, and milestones checked for age.",
    },
    {
      number: "03",
      title: "Childhood illnesses",
      text: "Fever, cough, loose motions, ear pain and rashes. No antibiotics or cough syrups unless they are needed.",
    },
    {
      number: "04",
      title: "Nutrition",
      text: "Starting solids at six months, iron rich home food, fussy eating and slow weight gain.",
    },
    {
      number: "05",
      title: "Vaccination",
      text: "The IAP schedule, given in the same visit. Missed doses are worked out from the record you bring.",
    },
    {
      number: "06",
      title: "Adolescent care",
      text: "Growth, puberty, periods, acne, weight and school stress, with time to talk to the child directly.",
    },
  ];

  const pediatricCareStages = [
    {
      age: "01",
      stage: "Newborn",
      to: "/newborn-care",
      description: "Feeding, sleep, cord care and jaundice in the first six weeks.",
    },
    {
      age: "02",
      stage: "Infancy",
      to: "/vaccination-guide",
      description: "Vaccines at 6, 10 and 14 weeks, then 6 and 9 months.",
    },
    {
      age: "03",
      stage: "Early childhood",
      to: "/growth-development",
      description: "Walking, talking and growing along the growth chart.",
    },
    {
      age: "04",
      stage: "School age",
      to: "/child-nutrition",
      description: "Eating well, fussy eating, iron and the common infections.",
    },
    {
      age: "05",
      stage: "Adolescence",
      to: "/appointment",
      description: "Puberty, growth, weight and school stress. Book a visit to talk it through.",
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
              Dr. Amreen sees children from the first week of life to the
              teenage years, Monday to Saturday, 3 to 9 pm, at Caspian
              Healthcare, Vijaynagar Colony.
            </p>

            <div className="pediatric-care-hero-actions">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pediatric-care-primary-button"
              >
                Book a visit
                <span>→</span>
              </a>

              <a
                href="#pediatric-care-areas"
                className="pediatric-care-secondary-button"
              >
                What she treats
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
              <figure className="fill-photo">
                <img
                  src="/assets/images/guides/mother-toddler.webp"
                  alt="A mother laughing with her toddler"
                  width="1200"
                  height="800"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="fill-photo-cap">Illustrative image</figcaption>
              </figure>
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
            <figure className="fill-photo"><img src="/assets/images/clinic/childrens-room.webp" alt="The children's room at Caspian Healthcare" loading="lazy" decoding="async" /></figure>
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
            <figure className="fill-photo"><img src="/assets/images/guides/growth-development.webp" alt="A smiling young girl sitting outdoors" loading="lazy" decoding="async" /><figcaption className="fill-photo-cap">Illustrative image</figcaption></figure>

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
                <NavLink
                  to={stage.to}
                  className="pediatric-care-stage pediatric-care-stage-link"
                  key={stage.age}
                >
                  <span className="pediatric-care-stage-number">
                    {stage.age}
                  </span>

                  <div className="pediatric-care-stage-content">
                    <h3>{stage.stage}</h3>
                    <p>{stage.description}</p>
                  </div>

                  <span className="pediatric-care-stage-arrow" aria-hidden="true">→</span>
                </NavLink>
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
              <figure className="fill-photo"><img src="/assets/images/guides/vaccination-guide.webp" alt="A mother holding her baby" loading="lazy" decoding="async" /><figcaption className="fill-photo-cap">Illustrative image</figcaption></figure>
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
            <figure className="fill-photo"><img src="/assets/images/guides/newborn-care.webp" alt="A mother holding her baby" loading="lazy" decoding="async" /><figcaption className="fill-photo-cap">Illustrative image</figcaption></figure>
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
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pediatric-care-cta-button"
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

export default PediatricCare;
