import React from "react";

import HomeDoorMarks from "../components/Home/HomeDoorMarks";
import {
  HomeHero,
  HomeUrgent,
  HomeReels,
  HomeTools,
  HomeBook,
  HomeClinic,
} from "../components/Home/HomeSections";

// Nov 2026: hero first, then the door frame marks (the site's signature
// piece), the emergency note, her Reels, the parent tools, Dear Mama and
// the clinic. Review extracts are no longer shown on the site; the clinic
// section links to her Google profile instead.
const Home = () => (
  <main className="home-page" id="main-content">
    <HomeHero />
    <HomeDoorMarks />
    <HomeUrgent />
    <HomeReels />
    <HomeTools />
    <HomeBook />
    <HomeClinic />
  </main>
);

export default Home;
