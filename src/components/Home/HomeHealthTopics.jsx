import React from "react";
import { NavLink } from "react-router-dom";
import CareIcon from "../common/CareIcon";
import "../../styles/Home/HomeHealthTopics.css";

const HomeHealthTopics = () => {
  const homeHealthTopics = [
    {
      number: "01",
      title: "Child Nutrition",
      description:
        "Simple, practical guidance to support healthy eating and growth through childhood.",
      path: "/child-nutrition",
      icon: "nutrition",
    },
    {
      number: "02",
      title: "Vaccination Guide",
      description:
        "Understand the importance of childhood vaccinations and staying on schedule.",
      path: "/vaccination-guide",
      icon: "vaccination",
    },
    {
      number: "03",
      title: "Newborn Care",
      description:
        "Helpful guidance for parents navigating the first precious weeks of their baby's life.",
      path: "/newborn-care",
      icon: "newborn",
    },
    {
      number: "04",
      title: "Growth & Development",
      description:
        "Learn about important developmental milestones and what to expect as children grow.",
      path: "/growth-development",
      icon: "growth",
    },
    {
      number: "05",
      title: "Childhood Illnesses",
      description:
        "Learn about common childhood health concerns and when professional care may be needed.",
      path: "/childhood-illnesses",
      icon: "illness",
    },
  ];

  return (
    <section className="home-health-topics">
      <div className="home-health-topics-container">
        <div className="home-health-topics-header">
          <div className="home-health-topics-heading">
            <span className="home-health-topics-eyebrow">Parent's Corner</span>

            <h2 className="home-health-topics-title">
              Helpful guidance for
              <span className="home-health-topics-title-highlight">
                every stage of childhood.
              </span>
            </h2>
          </div>

          <p className="home-health-topics-description">
            Parenting comes with many questions. Explore simple, reliable
            information to help you better understand your child's health and
            wellbeing.
          </p>
        </div>

        <div className="home-health-topics-layout">
          <div className="home-health-topics-feature">
            <CareIcon name="listen" className="home-health-topics-feature-icon" />

            <div className="home-health-topics-feature-overlay"></div>

            <div className="home-health-topics-feature-content">
              <span className="home-health-topics-feature-label">
                For growing families
              </span>

              <h3 className="home-health-topics-feature-title">
                Knowledge helps parents
                <span>feel prepared.</span>
              </h3>

              <p className="home-health-topics-feature-text">
                From newborn questions to nutrition, vaccines and development,
                find helpful information for the little people who matter most.
              </p>
            </div>
          </div>

          <div className="home-health-topics-grid">
            {homeHealthTopics.map((homeHealthTopic) => (
              <NavLink
                key={homeHealthTopic.path}
                to={homeHealthTopic.path}
                className="home-health-topics-card"
              >
                <div className="home-health-topics-card-image-wrapper">
                  <CareIcon name={homeHealthTopic.icon} />

                  <span className="home-health-topics-card-number">
                    {homeHealthTopic.number}
                  </span>
                </div>

                <div className="home-health-topics-card-content">
                  <h3 className="home-health-topics-card-title">
                    {homeHealthTopic.title}
                  </h3>

                  <p className="home-health-topics-card-description">
                    {homeHealthTopic.description}
                  </p>
                </div>

                <span className="home-health-topics-card-arrow">→</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHealthTopics;
