import React from "react";
import { BOOK, DOCTOR } from "../../data/site";
import "../../styles/Home/HomeBook.css";

const HomeBook = () => {
  return (
    <section className="home-book" aria-labelledby="home-book-title">
      <div className="home-book-container">
        <div className="home-book-visual">
          <img
            className="home-book-cover"
            src={BOOK.cover}
            alt={`Cover of ${BOOK.title}: ${BOOK.subtitle} by ${BOOK.author}`}
            width="520"
            height="802"
            loading="lazy"
            decoding="async"
          />

          <div className="home-book-badge">
            <span className="home-book-badge-label">Out now</span>
            <strong className="home-book-badge-text">On Amazon</strong>
          </div>
        </div>

        <div className="home-book-content">
          <span className="home-book-eyebrow">Her book for new mothers</span>

          <h2 className="home-book-title" id="home-book-title">
            {BOOK.title}
            <span className="home-book-title-accent">{BOOK.subtitle}</span>
          </h2>

          <p className="home-book-strapline">{BOOK.strapline}</p>

          <p className="home-book-blurb">{BOOK.blurb}</p>

          <p className="home-book-meta">
            Written by {DOCTOR.name}. {BOOK.publisher}, {BOOK.published}.{" "}
            {BOOK.pages} pages. ISBN {BOOK.isbn}.
          </p>

          <a
            className="home-book-button"
            href={BOOK.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Get it on Amazon</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeBook;
