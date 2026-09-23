import React from "react";
import CareIcon from "../components/common/CareIcon";
import { NavLink } from "react-router-dom";
import "../styles/ChildHealth.css";

const ChildHealth = () => {
  const childHealthTopics = [
    {
      number: "01",
      title: "Newborn & Infant Care",
      text: "The first months of life bring many questions for parents. Regular pediatric care helps monitor feeding, growth, sleep, development and overall wellbeing while giving parents the guidance they need.",
    },
    {
      number: "02",
      title: "Growth & Development",
      text: "Every child develops at their own pace. Monitoring physical growth, communication, learning, movement and social development helps identify concerns early and supports healthy childhood development.",
    },
    {
      number: "03",
      title: "Nutrition & Healthy Growth",
      text: "Good nutrition plays an important role in childhood growth. Age-appropriate meals, balanced nutrition and healthy eating habits help children build a strong foundation for their future health.",
    },
    {
      number: "04",
      title: "Vaccination & Prevention",
      text: "Vaccination is an important part of preventive pediatric care. Keeping immunisations up to date helps protect children from a range of vaccine-preventable infections.",
    },
    {
      number: "05",
      title: "Common Childhood Illnesses",
      text: "Fever, cough, cold, infections and digestive complaints are common reasons children may need medical attention. Understanding symptoms and knowing when to seek professional advice can help parents respond confidently.",
    },
    {
      number: "06",
      title: "School-Age Health",
      text: "As children grow, their healthcare needs change. Sleep, nutrition, physical activity, learning, emotional wellbeing and regular health assessments all contribute to a healthy school-age childhood.",
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
              Children's health is about much more than treating illness.
              Healthy growth, nutrition, development, prevention and emotional
              wellbeing all play an important role in helping children thrive.
            </p>

            <div className="child-health-hero-actions">
              <a
                href="https://www.eka.care/doctor/dr-amreen-pediatrician?cid=68032f8d25be81001d3d562e&utm_source=%2Fclinic%2F%5Bclinicslug%5D&utm_medium=eka-web&utm_campaign=web-navigation"
                target="_blank"
                rel="noopener noreferrer"
                className="child-health-hero-button"
              >
                <span>Book an Appointment</span>
                <span>↗</span>
              </a>

              <a href="#child-health-topics" className="child-health-hero-link">
                Explore child health
                <span>↓</span>
              </a>
            </div>
          </div>

          <div className="child-health-hero-visual">
            <div className="child-health-hero-image-main">
              <img
                src="/assets/images/clinic/clinic-team.jpg"
                alt="The team at Caspian Healthcare in the children’s consulting room, Hyderabad"
                width="1200"
                height="807"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="child-health-hero-image-small">
              <CareIcon name="heart" className="care-icon-soft" />
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
              Little changes can tell us
              <span>a lot about a child's wellbeing.</span>
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
                Areas that matter
                <span>through childhood.</span>
              </h2>
            </div>

            <p>
              From the early days of infancy to the school years, children's
              health involves many connected areas. Understanding these areas
              can help parents make informed decisions about everyday care.
            </p>
          </div>

          <div className="child-health-topics-grid">
            {childHealthTopics.map((topic) => (
              <article className="child-health-topic-card" key={topic.number}>
                <div className="child-health-topic-card-top">
                  <span>{topic.number}</span>
                  <span>+</span>
                </div>

                <h3>{topic.title}</h3>

                <p>{topic.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="child-health-feature">
        <div className="child-health-container">
          <div className="child-health-feature-layout">
            <div className="child-health-feature-image">
              <CareIcon name="listen" className="care-icon-soft" />

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
                Because every
                <span>child is different.</span>
              </h2>

              <p>
                Good pediatric care considers the individual child, their stage
                of development and the concerns of their family. Professional
                guidance can help parents feel more confident about the
                decisions they make for their child's health.
              </p>

              <a
                href="https://www.eka.care/doctor/dr-amreen-pediatrician?cid=68032f8d25be81001d3d562e&utm_source=%2Fclinic%2F%5Bclinicslug%5D&utm_medium=eka-web&utm_campaign=web-navigation"
                target="_blank"
                rel="noopener noreferrer"
                className="child-health-parent-button"
              >
                <span>Book an Appointment</span>
                <span>↗</span>
              </a>
            </div>

            <div className="child-health-parent-image">
              <CareIcon name="adolescent" className="care-icon-soft" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChildHealth;
