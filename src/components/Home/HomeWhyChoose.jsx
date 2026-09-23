import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Home/HomeWhyChoose.css";

const HomeWhyChoose = () => {
  const homeWhyChooseItems = [
    {
      number: "01",
      title: "Child-centred Care",
      description:
        "Every consultation begins with understanding the child and creating a comfortable experience.",
      icon: "♡",
    },
    {
      number: "02",
      title: "Clear Parent Guidance",
      description:
        "Medical concerns are explained in a simple and reassuring way, helping parents make informed decisions.",
      icon: "↗",
    },
    {
      number: "03",
      title: "Preventive Approach",
      description:
        "Regular check-ups, vaccinations, nutrition and healthy development are all part of caring for a growing child.",
      icon: "✓",
    },
    {
      number: "04",
      title: "Personalised Attention",
      description:
        "Each child has different needs, so care is approached with attention to their individual health and development.",
      icon: "+",
    },
  ];

  return (
    <section className="home-why-choose">
      <div className="home-why-choose-container">
        <div className="home-why-choose-header">
          <div className="home-why-choose-heading">
            <span className="home-why-choose-eyebrow">
              Why Parents Choose Us
            </span>

            <h2 className="home-why-choose-title">
              Because good pediatric care
              <span className="home-why-choose-title-highlight">
                starts with listening.
              </span>
            </h2>
          </div>

          <p className="home-why-choose-description">
            A child's healthcare journey should feel supportive, understandable
            and personal. Our approach keeps both children and parents at the
            heart of every visit.
          </p>
        </div>

        <div className="home-why-choose-content">
          <div className="home-why-choose-intro">
            <div className="home-why-choose-quote-mark">“</div>

            <blockquote className="home-why-choose-quote">
              Little patients may be small, but their needs deserve
              <span>big attention.</span>
            </blockquote>

            <div className="home-why-choose-line"></div>

            <p className="home-why-choose-note">
              From routine visits to everyday health concerns, the goal is to
              make pediatric care feel less overwhelming and more reassuring for
              families.
            </p>

            <NavLink to="/about" className="home-why-choose-link">
              <span>Learn More About Dr. Amreen</span>

              <span className="home-why-choose-link-arrow">→</span>
            </NavLink>
          </div>

          <div className="home-why-choose-grid">
            {homeWhyChooseItems.map((homeWhyChooseItem) => (
              <article
                key={homeWhyChooseItem.number}
                className="home-why-choose-card"
              >
                <div className="home-why-choose-card-top">
                  <span className="home-why-choose-card-number">
                    {homeWhyChooseItem.number}
                  </span>

                  <span className="home-why-choose-card-icon">
                    {homeWhyChooseItem.icon}
                  </span>
                </div>

                <h3 className="home-why-choose-card-title">
                  {homeWhyChooseItem.title}
                </h3>

                <p className="home-why-choose-card-description">
                  {homeWhyChooseItem.description}
                </p>

                <span className="home-why-choose-card-indicator"></span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeWhyChoose;
