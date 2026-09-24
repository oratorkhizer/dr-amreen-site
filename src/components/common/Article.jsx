import React from "react";
import { NavLink } from "react-router-dom";
import { ARTICLES } from "../../data/articles";
import { DOCTOR, CLINIC, OPD, BOOKING_URL } from "../../data/site";
import "../../styles/Article.css";

const Article = ({ slug }) => {
  const article = ARTICLES[slug];

  if (!article) {
    return null;
  }

  return (
    <main className="article-page" id="main-content">
      <section className="article-hero">
        <div className="article-container">
          <nav className="article-breadcrumb" aria-label="Breadcrumb">
            <NavLink to="/">Home</NavLink>
            <span aria-hidden="true">›</span>
            <NavLink to="/child-health">Child Health</NavLink>
            <span aria-hidden="true">›</span>
            <span>{article.title}</span>
          </nav>

          <span className="article-eyebrow">{article.eyebrow}</span>

          <h1 className="article-title">
            {article.title}
            <span className="article-title-accent">{article.titleAccent}</span>
          </h1>

          <p className="article-intro">{article.intro}</p>

          <p className="article-byline">
            Written for parents by {DOCTOR.name}, {DOCTOR.speciality},{" "}
            {CLINIC.name}, Hyderabad.
          </p>
        </div>
      </section>

      <section className="article-body">
        <div className="article-container article-layout">
          <div className="article-content">
            {article.sections.map((section) => (
              <section className="article-section" key={section.heading}>
                <h2 className="article-section-heading">{section.heading}</h2>

                {(section.paragraphs || []).map((paragraph) => (
                  <p className="article-paragraph" key={paragraph.slice(0, 40)}>
                    {paragraph}
                  </p>
                ))}

                {section.list && (
                  <ul className="article-list">
                    {section.list.map((item) => (
                      <li key={item.slice(0, 40)}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <aside className="article-flags" role="note">
              <h2 className="article-flags-heading">
                {article.redFlags.title}
              </h2>

              <ul className="article-flags-list">
                {article.redFlags.items.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>

              {article.redFlags.emergency ? (
                <p className="article-flags-note">
                  During OPD hours ({OPD.days}, {OPD.hours}) you can come to{" "}
                  {CLINIC.name} or call{" "}
                  <a href={`tel:${CLINIC.phoneE164}`}>{CLINIC.phone}</a>. At any
                  other time, or if your child looks very unwell, go straight to
                  the nearest hospital with a children's emergency department.{" "}
                  {CLINIC.name} does not run a paediatric emergency or an
                  inpatient ward for children.
                </p>
              ) : (
                <a
                  className="article-flags-call"
                  href={`tel:${CLINIC.phoneE164}`}
                >
                  Call the clinic on {CLINIC.phone}
                </a>
              )}
            </aside>
          </div>

          <aside className="article-aside">
            <div className="article-card">
              <h2 className="article-card-heading">See {DOCTOR.shortName}</h2>

              <dl className="article-card-list">
                <div>
                  <dt>Clinic</dt>
                  <dd>
                    {CLINIC.name}, {CLINIC.addressLine1},{" "}
                    {CLINIC.addressLine2}, {CLINIC.city} {CLINIC.postalCode}
                  </dd>
                </div>

                <div>
                  <dt>OPD</dt>
                  <dd>
                    {OPD.days}, {OPD.hours}. {OPD.closed}.
                  </dd>
                </div>

                <div>
                  <dt>Consultation</dt>
                  <dd>Rs {DOCTOR.consultationFee}</dd>
                </div>
              </dl>

              <a
                className="article-card-button"
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Book an Appointment</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="article-card article-card-quiet">
              <h2 className="article-card-heading">More for parents</h2>

              <nav className="article-card-links">
                {Object.entries(ARTICLES)
                  .filter(([key]) => key !== slug)
                  .map(([key, item]) => (
                    <NavLink key={key} to={`/${key}`}>
                      {item.title}
                    </NavLink>
                  ))}
              </nav>
            </div>
          </aside>
        </div>
      </section>

      <section className="article-disclaimer">
        <div className="article-container">
          <p>
            This page is general guidance for parents. It does not replace a
            consultation, and it is not a diagnosis for your child. If you are
            worried, please bring your child in.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Article;
