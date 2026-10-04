import React from "react";
import { NavLink } from "react-router-dom";
import { INSTAGRAM } from "../../data/site";
import "../../styles/Home/HomeWhyChoose.css";

const HomeWhyChoose = () => {
  const homeWhyChooseItems = [
    {
      number: "01",
      title: "Gold medallist, Niloufer trained",
      description:
        "MD Pediatrics from Osmania Medical College and Niloufer Hospital, Hyderabad's government hospital for women and children.",
      icon: "✓",
    },
    {
      number: "02",
      title: "A mother of three",
      description:
        "She is raising three children herself, so the advice is practical as well as textbook.",
      icon: "♡",
    },
    {
      number: "03",
      title: "Wrote the book for new mothers",
      description:
        "Dear Mama: The Fourth Trimester, her guide to the first months after birth, for the mother as much as the baby.",
      icon: "↗",
    },
    {
      number: "04",
      title: "Advice you can use at home",
      description:
        "Vaccine dates, growth and milestone checks on this site, and short videos for parents on Instagram, followed by " +
        INSTAGRAM.followers +
        " parents.",
      icon: "+",
    },
  ];


  return (
    <section className="home-why-choose">
      <div className="home-why-choose-container">
        <div className="home-why-choose-header">
          <div className="home-why-choose-heading">
            <span className="home-why-choose-eyebrow">
              Why parents choose her
            </span>

            <h2 className="home-why-choose-title">
              A pediatrician who has
              <span className="home-why-choose-title-highlight">
                been there too.
              </span>
            </h2>
          </div>

          <p className="home-why-choose-description">
            Training at Niloufer taught her the medicine. Raising three children
            taught her what parents actually worry about at home.
          </p>
        </div>

        <div className="home-why-choose-content">
          <div className="home-why-choose-intro">
            <div className="home-why-choose-quote-mark">“</div>

            <blockquote className="home-why-choose-quote">
              {INSTAGRAM.bio.split(",")[0]},
              <span>{INSTAGRAM.bio.split(",")[1].trim()}.</span>
            </blockquote>

            <div className="home-why-choose-line"></div>

            <p className="home-why-choose-note">
              In her own words, from her Instagram. That is what every visit is
              for.
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
