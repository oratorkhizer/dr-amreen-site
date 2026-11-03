import React from "react";
import { BOOKING_URL } from "../data/site";
import { NavLink } from "react-router-dom";
import "../styles/ChildHealth.css";

const ChildHealth = () => {
  // Each card is a real link to a guide on this site (audit 3 Nov 2026:
  // the old cards repeated the Pediatric Care page and led nowhere).
  const childHealthTopics = [
    {
      number: "01",
      title: "Newborn care",
      to: "/newborn-care",
      text: "Feeding, sleep, cord care and jaundice in the first six weeks, and the signs that need a doctor.",
    },
    {
      number: "02",
      title: "Vaccine dates",
      to: "/vaccination-guide",
      text: "The IAP schedule, and every due date for your child worked out from the date of birth.",
    },
    {
      number: "03",
      title: "Growth and milestones",
      to: "/growth-development",
      text: "Plot weight, height and head size on the growth charts, and check milestones for your child's age.",
    },
    {
      number: "04",
      title: "Feeding by age",
      to: "/child-nutrition",
      text: "Breast milk, starting solids at six months, iron rich food and what to do with a fussy eater.",
    },
    {
      number: "05",
      title: "Common illnesses",
      to: "/childhood-illnesses",
      text: "Fever, cough, loose motions and rashes: what settles at home and what needs to be seen.",
    },
    {
      number: "06",
      title: "For new mothers",
      to: "/new-mothers",
      text: "Meet your baby's doctor before the birth, with a checklist for the first six weeks.",
    },
  ];

  return (
    <main className="child-health">
      <section className="child-health-hero">
        <div className="child-health-hero-container">
          <div className="child-health-hero-content">
            <span className="child-health-hero-eyebrow">A Parent's Guide</span>

            <h1 className="child-health-hero-title">
              A parent's guide to
              <span>your child's health.</span>
            </h1>

            <p className="child-health-hero-description">
              Short guides written by Dr. Amreen for the questions parents ask
              most: newborn care, vaccines, growth, feeding and common
              illnesses. Each one says plainly what can wait and what cannot.
            </p>

            <div className="child-health-hero-actions">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="child-health-hero-button"
              >
                <span>Book a visit</span>
                <span>↗</span>
              </a>

              <a href="#child-health-topics" className="child-health-hero-link">
                See the guides
                <span>↓</span>
              </a>
            </div>
          </div>

          <div className="child-health-hero-visual">
            <div className="child-health-hero-image-main">
              <figure className="fill-photo">
                <img
                  src="/assets/images/guides/child-smiling.webp"
                  alt="A young girl laughing outdoors"
                  width="1200"
                  height="800"
                  fetchPriority="high"
                  decoding="async"
                />
                <figcaption className="fill-photo-cap">Illustrative image</figcaption>
              </figure>
            </div>

            <div className="child-health-hero-note">
              <span className="child-health-hero-note-icon">+</span>
              <div>
                <strong>Healthy childhood</strong>
                <span>starts with good care</span>
              </div>
            </div>

            <span className="child-health-hero-shape child-health-hero-shape-one"></span>
            <span className="child-health-hero-shape child-health-hero-shape-two"></span>
          </div>
        </div>
      </section>

      <section className="child-health-intro">
        <div className="child-health-container">
          <div className="child-health-intro-label">
            <span>01</span>
            <span>Understanding Child Health</span>
          </div>

          <div className="child-health-intro-content">
            <h2>
              Small changes
              <span>can tell us a lot.</span>
            </h2>

            <div className="child-health-intro-text">
              <p>
                Childhood is a period of continuous physical, mental and
                emotional development. A child's healthcare needs can change
                quickly as they move from infancy through school age and
                adolescence.
              </p>

              <p>
                Pediatric care provides parents with a place to discuss concerns
                about growth, nutrition, development, immunity, infections,
                sleep and other aspects of their child's health.
              </p>

              <p>
                Regular attention to these areas can help parents understand
                what is normal for their child's age and when a concern may need
                professional evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="child-health-topics" id="child-health-topics">
        <div className="child-health-container">
          <div className="child-health-section-heading">
            <div>
              <span className="child-health-section-eyebrow">
                Children's Wellbeing
              </span>

              <h2>
                Guides for parents,
                <span>by age and by worry.</span>
              </h2>
            </div>

            <p>
              Each guide is written in plain words and reviewed by Dr. Amreen.
              The vaccine and growth pages have tools you can use at home.
            </p>
          </div>

          <div className="child-health-topics-grid">
            {childHealthTopics.map((topic) => (
              <NavLink
                to={topic.to}
                className="child-health-topic-card child-health-topic-link"
                key={topic.number}
              >
                <div className="child-health-topic-card-top">
                  <span>{topic.number}</span>
                  <span aria-hidden="true">→</span>
                </div>

                <h3>{topic.title}</h3>

                <p>{topic.text}</p>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      <section className="child-health-feature">
        <div className="child-health-container">
          <div className="child-health-feature-layout">
            <div className="child-health-feature-image">
              <figure className="fill-photo"><img src="/assets/images/guides/childhood-illnesses.webp" alt="A mother sitting with her young child" loading="lazy" decoding="async" /><figcaption className="fill-photo-cap">Illustrative image</figcaption></figure>

              <div className="child-health-feature-image-caption">
                <span>Growing well</span>
                <strong>One step at a time.</strong>
              </div>
            </div>

            <div className="child-health-feature-content">
              <span className="child-health-section-eyebrow">For Parents</span>

              <h2>
                Your questions
                <span>are important.</span>
              </h2>

              <p>
                Parents often notice small changes before anyone else does. A
                change in appetite, sleep, activity, behaviour or development
                may simply be part of growing up, but discussing concerns with a
                pediatrician can provide reassurance and appropriate guidance.
              </p>

              <p>
                Pediatric consultations are also an opportunity to discuss
                everyday questions that may not feel urgent but are important
                for a child's long-term wellbeing.
              </p>

              <div className="child-health-feature-list">
                <div>
                  <span>✓</span>
                  <p>Growth and development concerns</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Nutrition and feeding questions</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Vaccination and preventive care</p>
                </div>

                <div>
                  <span>✓</span>
                  <p>Common childhood health concerns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="child-health-parent">
        <div className="child-health-container">
          <div className="child-health-parent-box">
            <div className="child-health-parent-content">
              <span className="child-health-section-eyebrow">
                Pediatric Care
              </span>

              <h2>
                Still not sure?
                <span>Bring your child in.</span>
              </h2>

              <p>
                A guide cannot examine your child. If something worries you,
                book a visit with Dr. Amreen, Monday to Saturday, 3 to 9 pm,
                at Caspian Healthcare, Vijaynagar Colony.
              </p>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="child-health-parent-button"
              >
                <span>Book a visit</span>
                <span>↗</span>
              </a>
            </div>

            <div className="child-health-parent-image">
              <figure className="fill-photo"><img src="/assets/images/guides/child-nutrition.webp" alt="A toddler eating with his hands" loading="lazy" decoding="async" /><figcaption className="fill-photo-cap">Illustrative image</figcaption></figure>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChildHealth;
