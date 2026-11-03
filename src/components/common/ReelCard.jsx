import React, { useState } from "react";

// One Instagram Reel in Instagram's own player, so the cover is her real
// frame. The browser loads it only when it scrolls near the screen. Until it
// has loaded, a play mark and a short label sit on top, so a slow connection
// never shows an empty box (audit 3 Nov 2026).
const ReelCard = ({ id, title }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <figure className="reel-card">
      <div className={loaded ? "reel-shell is-loaded" : "reel-shell"}>
        <iframe
          className="reel-frame"
          src={`https://www.instagram.com/reel/${id}/embed/`}
          title={title}
          loading="lazy"
          allow="encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
        <span className="reel-shell-cover" aria-hidden="true">
          <span className="reel-shell-play">▶</span>
          <span className="reel-shell-text">Video from her Instagram</span>
        </span>
      </div>
      <figcaption>{title}</figcaption>
    </figure>
  );
};

export default ReelCard;
