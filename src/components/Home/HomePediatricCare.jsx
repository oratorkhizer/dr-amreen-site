import React from "react";
import { NavLink } from "react-router-dom";
import CareIcon from "../common/CareIcon";
import "../../styles/Home/HomePediatricCare.css";

const HomePediatricCare = () => {
  const pediatricCareItems = [
    {
      number: "01",
      title: "Newborn & Infant Care",
      description:
        "Gentle, attentive care during your child's earliest and most important stages.",
      icon: "newborn",
    },
    {
      number: "02",
      title: "Growth & Development",
      description:
        "Monitoring physical, emotional and developmental milestones as your child grows.",
      icon: "growth",
    },
    {
      number: "03",
      title: "Vaccination & Prevention",
      description:
        "Keeping your child protected with age-appropriate vaccinations and preventive care.",
      icon: "vaccination",
    },
    {
      number: "04",
      title: "Childhood Illness",
      description:
        "Thoughtful evaluation and treatment for common childhood illnesses and concerns.",
      icon: "illness",
    },
  ];

  return (
    <section className="home-pediatric-care">
      <div className="home-pediatric-care-container">
        <div className="home-pediatric-care-header">
          <div className="home-pediatric-care-heading">
            <span className="home-pediatric-care-eyebrow">Pediatric Care</span>

            <h2 className="home-pediatric-care-title">
              Care for every
              <span className="home-pediatric-care-title-highlight">
                little milestone.
              </span>
            </h2>
          </div>

          <div className="home-pediatric-care-intro">
            <p className="home-pediatric-care-description">
              From the first days of life through the growing years, Dr. Amreen
              provides personalised pediatric care designed around your child's
              unique needs.
            </p>

            <NavLink to="/pediatric-care" className="home-pediatric-care-link">
              <span>Explore Pediatric Care</span>

              <span className="home-pediatric-care-link-arrow">→</span>
            </NavLink>
          </div>
        </div>

        <div className="home-pediatric-care-grid">
          {pediatricCareItems.map((pediatricCareItem) => (
            <article
              key={pediatricCareItem.number}
              className="home-pediatric-care-card"
            >
              <div className="home-pediatric-care-card-image-wrapper">
                <CareIcon name={pediatricCareItem.icon} />

                <span className="home-pediatric-care-card-number">
                  {pediatricCareItem.number}
                </span>
              </div>

              <div className="home-pediatric-care-card-content">
                <h3 className="home-pediatric-care-card-title">
                  {pediatricCareItem.title}
                </h3>

                <p className="home-pediatric-care-card-description">
                  {pediatricCareItem.description}
                </p>
              </div>

              <span className="home-pediatric-care-card-line"></span>
            </article>
          ))}
        </div>

        <div className="home-pediatric-care-bottom">
          <div className="home-pediatric-care-bottom-message">
            <span className="home-pediatric-care-bottom-dot"></span>

            <span>Every child is different. Their care should be too.</span>
          </div>

          <NavLink
            to="/appointment"
            className="home-pediatric-care-bottom-button"
          >
            Book a Consultation
            <span>→</span>
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default HomePediatricCare;
