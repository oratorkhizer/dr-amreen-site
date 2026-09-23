import React from "react";

import HomeHero from "../components/Home/HomeHero";
import HomeDoctor from "../components/Home/HomeDoctor";
import HomePediatricCare from "../components/Home/HomePediatricCare";
import HomeHealthTopics from "../components/Home/HomeHealthTopics";
import HomeBook from "../components/Home/HomeBook";
import HomeWhyChoose from "../components/Home/HomeWhyChoose";
import HomeTestimonials from "../components/Home/HomeTestimonials";
import HomeAppointment from "../components/Home/HomeAppointment";
import HomeClinic from "../components/Home/HomeClinic";

const Home = () => {
  return (
    <main className="home-page" id="main-content">
      <HomeHero />

      <HomeDoctor />

      <HomePediatricCare />

      <HomeHealthTopics />

      <HomeBook />

      <HomeWhyChoose />

      <HomeTestimonials />

      <HomeAppointment />

      <HomeClinic />
    </main>
  );
};

export default Home;
