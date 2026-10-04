import React, { useState } from "react";

// One Instagram Reel. Shows a light poster first and loads Instagram's own
// player only when the visitor taps, so the page stays fast and Instagram
// sets nothing in the visitor's browser until they choose to watch.
const ReelCard = ({ id, title, tone = 0 }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className={`reel-card reel-tone-${tone % 4}`}>
      {playing ? (
        <iframe
          className="reel-frame"
          src={`https://www.instagram.com/reel/${id}/embed/`}
          title={title}
          loading="lazy"
          allow="encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="reel-poster" onClick={() => setPlaying(true)}>
          <span className="reel-play" aria-hidden="true">▶</span>
          <span className="reel-title">{title}</span>
          <span className="reel-hint">Tap to watch on Instagram</span>
        </button>
      )}
      <figcaption>
        <a href={`https://www.instagram.com/reel/${id}/`} target="_blank" rel="noopener noreferrer">
          Open on Instagram ↗
        </a>
      </figcaption>
    </figure>
  );
};

export default ReelCard;
