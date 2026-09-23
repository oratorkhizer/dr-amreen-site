import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [navbarMenuOpen, setNavbarMenuOpen] = useState(false);

  const navbarToggleMenu = () => {
    setNavbarMenuOpen((previousState) => !previousState);
  };

  const navbarCloseMenu = () => {
    setNavbarMenuOpen(false);
  };

  const navbarLinks = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "About Dr. Amreen",
      path: "/about",
    },
    {
      label: "Pediatric Care",
      path: "/pediatric-care",
    },
    {
      label: "Child Health",
      path: "/child-health",
    },
    {
      label: "Contact",
      path: "/contact",
    },
  ];

  return (
    <header className="navbar-head">
      <div className="navbar-container">
        {/* =========================================
            BRAND
           ========================================= */}

        <NavLink to="/" className="navbar-brand" onClick={navbarCloseMenu}>
          <div className="navbar-brand-mark">
            <div className="navbar-brand-circle">
              <span className="navbar-brand-cross"></span>
              <span className="navbar-brand-cross-vertical"></span>
            </div>

            <span className="navbar-brand-dot navbar-brand-dot-one"></span>
            <span className="navbar-brand-dot navbar-brand-dot-two"></span>
            <span className="navbar-brand-dot navbar-brand-dot-three"></span>
          </div>

          <div className="navbar-brand-content">
            <span className="navbar-brand-name">Dr. Amreen</span>

            <span className="navbar-brand-speciality">Pediatrician</span>
          </div>
        </NavLink>

        {/* =========================================
            DESKTOP NAVIGATION
           ========================================= */}

        <nav className="navbar-navigation">
          {navbarLinks.map((navbarLink) => (
            <NavLink
              key={navbarLink.path}
              to={navbarLink.path}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "navbar-link-active" : ""}`
              }
              onClick={navbarCloseMenu}
            >
              {navbarLink.label}
            </NavLink>
          ))}
        </nav>

        {/* =========================================
            APPOINTMENT CTA
           ========================================= */}

        <a
          href="https://www.eka.care/doctor/dr-amreen-pediatrician?cid=68032f8d25be81001d3d562e&utm_source=%2Fclinic%2F%5Bclinicslug%5D&utm_medium=eka-web&utm_campaign=web-navigation"
          className="navbar-appointment"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="navbar-appointment-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8 3V6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M16 3V6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <rect
                x="4"
                y="5"
                width="16"
                height="16"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path d="M4 10H20" stroke="currentColor" strokeWidth="1.8" />

              <path
                d="M12 13V17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M10 15H14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className="navbar-appointment-text">Book Appointment</span>

          <span className="navbar-appointment-arrow">→</span>
        </a>

        {/* =========================================
            MOBILE MENU BUTTON
           ========================================= */}

        <button
          type="button"
          className={`navbar-menu-button ${
            navbarMenuOpen ? "navbar-menu-button-active" : ""
          }`}
          onClick={navbarToggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={navbarMenuOpen}
        >
          <span className="navbar-menu-line"></span>
          <span className="navbar-menu-line"></span>
          <span className="navbar-menu-line"></span>
        </button>
      </div>

      {/* =========================================
          MOBILE NAVIGATION
         ========================================= */}

      <div
        className={`navbar-mobile-panel ${
          navbarMenuOpen ? "navbar-mobile-panel-active" : ""
        }`}
      >
        <nav className="navbar-mobile-navigation">
          {navbarLinks.map((navbarLink) => (
            <NavLink
              key={navbarLink.path}
              to={navbarLink.path}
              className={({ isActive }) =>
                `navbar-mobile-link ${
                  isActive ? "navbar-mobile-link-active" : ""
                }`
              }
              onClick={navbarCloseMenu}
            >
              <span className="navbar-mobile-link-text">
                {navbarLink.label}
              </span>

              <span className="navbar-mobile-link-arrow">→</span>
            </NavLink>
          ))}

          <a
            href="https://www.eka.care/doctor/dr-amreen-pediatrician?cid=68032f8d25be81001d3d562e&utm_source=%2Fclinic%2F%5Bclinicslug%5D&utm_medium=eka-web&utm_campaign=web-navigation"
            className="navbar-mobile-appointment"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Book an Appointment</span>

            <span className="navbar-mobile-appointment-arrow">→</span>
          </a>
        </nav>
      </div>

      {/* =========================================
          PEDIATRIC DECORATIONS
         ========================================= */}

      <span className="navbar-decoration navbar-decoration-one"></span>
      <span className="navbar-decoration navbar-decoration-two"></span>
      <span className="navbar-decoration navbar-decoration-three"></span>
    </header>
  );
};

export default Navbar;
