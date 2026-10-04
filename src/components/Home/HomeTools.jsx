import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Home/HomeTools.css";

// Four things a parent can do on this site in under a minute. Each one
// runs in the browser; nothing is sent unless the parent asks for reminders.
const TOOLS = [
  {
    to: "/vaccination-guide#vaccine-dates",
    kicker: "Enter the date of birth",
    title: "Your child's vaccine dates",
    text: "Every visit on the IAP 2023 schedule with its exact date, and all of them in your phone's calendar in one tap.",
  },
  {
    to: "/growth-development#growth-heading",
    kicker: "Weight and height",
    title: "Is my child growing well?",
    text: "Plot weight, height and head size on the WHO and IAP charts. You can read them straight off a lab or clinic report.",
  },
  {
    to: "/growth-development#milestones-heading",
    kicker: "Tick what they can do",
    title: "Milestone check",
    text: "What most children can do by your child's age, and which gaps are worth an assessment.",
  },
  {
    to: "/new-mothers",
    kicker: "Expecting a baby?",
    title: "Meet your baby's doctor first",
    text: "A visit before the birth, a checklist for the first six weeks, and her book for new mothers.",
  },
];

const HomeTools = () => (
  <section className="home-tools" aria-labelledby="home-tools-title">
    <div className="home-tools-container">
      <div className="home-tools-header">
        <p className="home-tools-eyebrow">Tools for parents</p>
        <h2 className="home-tools-title" id="home-tools-title">
          Answers you can get
          <span className="home-tools-title-accent"> at home, tonight.</span>
        </h2>
      </div>

      <div className="home-tools-grid">
        {TOOLS.map((tool) => (
          <NavLink key={tool.to} to={tool.to} className="home-tools-card">
            <span className="home-tools-kicker">{tool.kicker}</span>
            <strong className="home-tools-name">{tool.title}</strong>
            <span className="home-tools-text">{tool.text}</span>
            <span className="home-tools-go" aria-hidden="true">→</span>
          </NavLink>
        ))}
      </div>
    </div>
  </section>
);

export default HomeTools;
