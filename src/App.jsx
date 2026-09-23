import React, { useEffect, useLayoutEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/common/Footer";
import Seo from "./components/common/Seo";

import Home from "./pages/Home";
import About from "./pages/About";
import PediatricCare from "./pages/PediatricCare";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";

import ChildNutrition from "./home-pages/ChildNutrition";
import VaccinationGuide from "./home-pages/VaccinationGuide";
import NewbornCare from "./home-pages/NewbornCare";
import GrowthDevelopment from "./home-pages/GrowthDevelopment";
import ChildhoodIllnesses from "./home-pages/ChildhoodIllnesses";
import ChildHealth from "./pages/ChildHealth";
import Enquiries from "./pages/Enquiries";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

const Layout = () => {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <ScrollToTop />
      <Seo />
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "pediatric-care",
        element: <PediatricCare />,
      },
      {
        path: "child-health",
        element: <ChildHealth />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "appointment",
        element: <Appointment />,
      },
      {
        path: "child-nutrition",
        element: <ChildNutrition />,
      },
      {
        path: "vaccination-guide",
        element: <VaccinationGuide />,
      },
      {
        path: "newborn-care",
        element: <NewbornCare />,
      },
      {
        path: "growth-development",
        element: <GrowthDevelopment />,
      },
      {
        path: "childhood-illnesses",
        element: <ChildhoodIllnesses />,
      },
      {
        path: "enquiries",
        element: <Enquiries />,
      },
      {
        path: "*",
        element: (
          <main className="app-not-found" id="main-content">
            <div className="app-not-found-content">
              <span className="app-not-found-number">404</span>

              <h1 className="app-not-found-title">Page not found</h1>

              <p className="app-not-found-text">
                This page does not exist, or it may have moved. Try the home
                page, or get in touch with the clinic.
              </p>

              <a href="/" className="app-not-found-button">
                Back to home
              </a>
            </div>
          </main>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
