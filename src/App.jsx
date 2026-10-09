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
import NewMothers from "./pages/NewMothers";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  // /page#section links from the home page tools: wait for the page to
  // render, then bring the section into view.
  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      tries += 1;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        clearInterval(timer);
      } else if (tries > 20) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [pathname, hash]);

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

// The route table is exported so scripts/build-routes.mjs can render every
// page to static HTML at build time (via src/entry-server.jsx). Crawlers and
// link previews then see real headings and text without running JavaScript.
// The browser router is created on first render, never at import time, so
// this file can be imported in Node.
export const routes = [
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
        path: "new-mothers",
        element: <NewMothers />,
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
,
];

let router;

const App = () => {
  if (!router) router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};

export default App;
