import React, { useRef, useState } from "react";
import CareIcon from "../common/CareIcon";
import { GOOGLE_REVIEWS_URL } from "../../data/site";
import "../../styles/Home/HomeTestimonials.css";

const HomeTestimonials = () => {
  // Short excerpts from reviews parents left on Google, trimmed only for
  // length. Nothing is reworded. Each card links to the full public listing
  // so a reader can check the source, and no review is presented as a claim
  // about treatment outcomes.
  const homeTestimonials = [
    {
      quote:
        "The staff and environment are very supportive, making it a stress-free experience for parents and kids alike.",
      name: "Arman Khan",
      relation: "Review on Google",
    },
    {
      quote:
        "Extremely gentle and patient with children, and very reassuring to parents. I especially appreciated how you took the time to explain each step and answer all my questions, which helped ease my anxiety as a new mom.",
      name: "Tahniyath Yasmeen",
      relation: "Review on Google",
    },
    {
      quote:
        "She treated my son with great care and patience. The clinic is well-maintained, and the overall experience was very positive.",
      name: "Ashaaz Mohammed",
      relation: "Review on Google",
    },
  ];

  const [homeTestimonialsActive, setHomeTestimonialsActive] = useState(0);
  const homeTestimonialsTouchStart = useRef(null);
  const homeTestimonialsTouchEnd = useRef(null);

  const homeTestimonialsMinimumSwipe = 50;

  const homeTestimonialsPrevious = () => {
    setHomeTestimonialsActive((current) =>
      current === 0 ? homeTestimonials.length - 1 : current - 1,
    );
  };

  const homeTestimonialsNext = () => {
    setHomeTestimonialsActive((current) =>
      current === homeTestimonials.length - 1 ? 0 : current + 1,
    );
  };

  const homeTestimonialsTouchStartHandler = (event) => {
    homeTestimonialsTouchStart.current = event.targetTouches[0].clientX;
  };

  const homeTestimonialsTouchMoveHandler = (event) => {
    homeTestimonialsTouchEnd.current = event.targetTouches[0].clientX;
  };

  const homeTestimonialsTouchEndHandler = () => {
    if (
      !homeTestimonialsTouchStart.current ||
      !homeTestimonialsTouchEnd.current
    ) {
      return;
    }

    const homeTestimonialsDistance =
      homeTestimonialsTouchStart.current - homeTestimonialsTouchEnd.current;

    if (Math.abs(homeTestimonialsDistance) < homeTestimonialsMinimumSwipe) {
      return;
    }

    if (homeTestimonialsDistance > 0) {
      homeTestimonialsNext();
    } else {
      homeTestimonialsPrevious();
    }

    homeTestimonialsTouchStart.current = null;
    homeTestimonialsTouchEnd.current = null;
  };

  const homeTestimonialsCurrent = homeTestimonials[homeTestimonialsActive];

  return (
    <section className="home-testimonials">
      <div className="home-testimonials-container">
        <div className="home-testimonials-header">
          <div className="home-testimonials-heading">
            <span className="home-testimonials-eyebrow">Google Reviews</span>

            <h2 className="home-testimonials-title">
              What parents say
              <span className="home-testimonials-title-highlight">
                about their experience.
              </span>
            </h2>
          </div>

          <p className="home-testimonials-description">
            These are short extracts from reviews parents left publicly. You can
            read all of them, unedited, on the listing below.
          </p>
        </div>

        <div className="home-testimonials-content">
          <div className="home-testimonials-visual">
            <div className="home-testimonials-visual-image-wrapper">
              <CareIcon name="heart" className="care-icon-soft" />
            </div>

            <div className="home-testimonials-visual-badge">
              <span className="home-testimonials-visual-badge-stars">
                ★★★★★
              </span>

              <span className="home-testimonials-visual-badge-text">
                Google Reviews
              </span>
            </div>
          </div>

          <div
            className="home-testimonials-slider"
            onTouchStart={homeTestimonialsTouchStartHandler}
            onTouchMove={homeTestimonialsTouchMoveHandler}
            onTouchEnd={homeTestimonialsTouchEndHandler}
          >
            <div className="home-testimonials-card">
              <div className="home-testimonials-card-top">
                <div className="home-testimonials-card-heading">
                  <span className="home-testimonials-card-label">
                    Parent's Words
                  </span>

                  <a
                    className="home-testimonials-card-source"
                    href={GOOGLE_REVIEWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read all reviews ↗
                  </a>
                </div>

                <div
                  className="home-testimonials-stars"
                  aria-label="5 star review"
                >
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
              </div>

              <div className="home-testimonials-quote-mark">“</div>

              <div className="home-testimonials-quote-wrapper">
                <blockquote
                  className="home-testimonials-quote"
                  key={homeTestimonialsActive}
                >
                  {homeTestimonialsCurrent.quote}
                </blockquote>
              </div>

              <div className="home-testimonials-author">
                <div className="home-testimonials-author-avatar">G</div>

                <div className="home-testimonials-author-content">
                  <strong className="home-testimonials-author-name">
                    {homeTestimonialsCurrent.name}
                  </strong>

                  <span className="home-testimonials-author-relation">
                    {homeTestimonialsCurrent.relation}
                  </span>
                </div>
              </div>

              <div className="home-testimonials-controls">
                <div className="home-testimonials-counter">
                  <strong>
                    {String(homeTestimonialsActive + 1).padStart(2, "0")}
                  </strong>

                  <span>/</span>

                  <span>
                    {String(homeTestimonials.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="home-testimonials-buttons">
                  <button
                    type="button"
                    className="home-testimonials-button"
                    onClick={homeTestimonialsPrevious}
                    aria-label="Previous review"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    className="home-testimonials-button home-testimonials-button-next"
                    onClick={homeTestimonialsNext}
                    aria-label="Next review"
                  >
                    →
                  </button>
                </div>
              </div>

              <span className="home-testimonials-mobile-hint">
                Swipe to see more reviews
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
