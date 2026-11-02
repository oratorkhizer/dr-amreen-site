import React from "react";

// One Instagram Reel in Instagram's own player, so the cover is her real
// frame. The browser loads it only when it scrolls near the screen.
const ReelCard = ({ id, title }) => (
  <figure className="reel-card">
    <iframe
      className="reel-frame"
      src={`https://www.instagram.com/reel/${id}/embed/`}
      title={title}
      loading="lazy"
      allow="encrypted-media; picture-in-picture"
      allowFullScreen
    />
    <figcaption>{title}</figcaption>
  </figure>
);

export default ReelCard;
