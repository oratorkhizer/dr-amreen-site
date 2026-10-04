import React from "react";
import ReelCard from "../common/ReelCard";
import { INSTAGRAM, REELS } from "../../data/site";
import "../../styles/Reels.css";

const HomeReels = () => (
  <section className="home-reels" aria-labelledby="home-reels-title">
    <div className="home-reels-container">
      <div className="home-reels-header">
        <div>
          <p className="home-reels-eyebrow">From her Instagram</p>
          <h2 className="home-reels-title" id="home-reels-title">
            One minute of advice,
            <span className="home-reels-title-accent"> from one mother to another.</span>
          </h2>
        </div>
        <p className="home-reels-text">
          {INSTAGRAM.followers} parents follow {INSTAGRAM.handle} for short,
          plain answers to the questions that come up at home.
        </p>
      </div>

      <div className="home-reels-grid">
        {REELS.map((reel, i) => (
          <ReelCard key={reel.id} id={reel.id} title={reel.title} tone={i} />
        ))}
      </div>

      <a className="home-reels-follow" href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer">
        Follow {INSTAGRAM.handle} <span aria-hidden="true">↗</span>
      </a>
    </div>
  </section>
);

export default HomeReels;
