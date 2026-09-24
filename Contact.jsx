import React, { useState } from "react";
import {
  DOCTOR,
  CLINIC,
  OPD,
  BOOKING_URL,
  SUPABASE,
} from "../data/site";
import "../styles/Contact.css";

const SUBJECTS = [
  { value: "appointment", label: "Appointment enquiry" },
  { value: "consultation", label: "Pediatric consultation" },
  { value: "reports", label: "Reports and test results" },
  { value: "general", label: "General enquiry" },
  { value: "other", label: "Other" },
];

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [contactFormData, setContactFormData] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [errorText, setErrorText] = useState("");

  const contactHandleChange = (event) => {
    const { name, value } = event.target;

    setContactFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const contactHandleSubmit = async (event) => {
    event.preventDefault();

    const digits = contactFormData.phone.replace(/\D/g, "");

    if (digits.length < 10) {
      setStatus("error");
      setErrorText("Please enter a 10 digit mobile number.");
      return;
    }

    setStatus("sending");
    setErrorText("");

    try {
      const response = await fetch(
        `${SUPABASE.url}/rest/v1/${SUPABASE.table}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE.anonKey,
            Authorization: `Bearer ${SUPABASE.anonKey}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            name: contactFormData.name.trim(),
            phone: contactFormData.phone.trim(),
            email: contactFormData.email.trim() || null,
            subject: contactFormData.subject,
            message: contactFormData.message.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setStatus("sent");
      setContactFormData(EMPTY_FORM);
    } catch (error) {
      setStatus("error");
      setErrorText(
        "Sorry, the enquiry could not be sent. Please call the clinic on " +
          CLINIC.phone +
          " instead."
      );
    }
  };

  return (
    <main className="contact-page" id="main-content">
      <section className="contact-hero">
        <div className="contact-container">
          <div className="contact-hero-content">
            <span className="contact-eyebrow">Get in Touch</span>

            <h1 className="contact-title">
              We're here when
              <span>your child needs care.</span>
            </h1>

            <p className="contact-intro">
              Have a question about your child's health, or need help with a
              consultation? Call the clinic, come during OPD hours, or send an
              enquiry below. {DOCTOR.shortName} consults at {CLINIC.name},
              Vijaynagar Colony, Hyderabad.
            </p>
          </div>

          <div className="contact-hero-line">
            <span className="contact-hero-line-number">01</span>
            <span className="contact-hero-line-text">
              Pediatric Care · Hyderabad
            </span>
          </div>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-container">
          <div className="contact-layout">
            <aside className="contact-information">
              <div className="contact-information-heading">
                <span className="contact-section-label">Contact Details</span>

                <h2 className="contact-information-title">
                  Let's make your
                  <span>next step easier.</span>
                </h2>

                <p className="contact-information-description">
                  The clinic reception can help with directions, reports and
                  general questions. Appointments are booked online.
                </p>
              </div>

              <div className="contact-details">
                <a
                  href={`tel:${CLINIC.phoneE164}`}
                  className="contact-detail contact-detail-action"
                >
                  <span className="contact-detail-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6.5 3.5L9 3L11 8L8.5 9.5C9.6 11.8 11.5 13.7 14 14.7L15.5 12L20.5 14V17.5C20.5 19.2 19.2 20.5 17.5 20.5C9.8 20 4 14.2 3.5 6.5C3.5 4.8 4.8 3.5 6.5 3.5Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <span className="contact-detail-content">
                    <small>Call the clinic</small>
                    <strong>{CLINIC.phone}</strong>
                    <span>Reception, for enquiries and reports</span>
                  </span>

                  <span className="contact-detail-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>

                <a
                  href={CLINIC.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-detail contact-detail-action"
                >
                  <span className="contact-detail-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 10C20 15 12 21 12 21C12 21 4 15 4 10C4 5.6 7.6 2 12 2C16.4 2 20 5.6 20 10Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                  </span>

                  <span className="contact-detail-content">
                    <small>Visit</small>
                    <strong>{CLINIC.name}</strong>
                    <span>
                      {CLINIC.addressLine1}, {CLINIC.addressLine2},{" "}
                      {CLINIC.city} {CLINIC.postalCode}
                    </span>
                  </span>

                  <span className="contact-detail-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>

                <div className="contact-detail">
                  <span className="contact-detail-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M12 7V12L15 14"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <span className="contact-detail-content">
                    <small>OPD timings</small>
                    <strong>
                      {OPD.days}, {OPD.hours}
                    </strong>
                    <span>
                      {OPD.closed}. Consultation Rs {DOCTOR.consultationFee}.
                    </span>
                  </span>
                </div>
              </div>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-appointment"
              >
                <span>Book an Appointment</span>
                <span aria-hidden="true">↗</span>
              </a>

              <p className="contact-note">
                Appointments are not given over the phone. Please book your slot
                online so your turn is held for you.
              </p>
            </aside>

            <div className="contact-form-wrapper">
              <div className="contact-form-header">
                <span className="contact-section-label">Send an Enquiry</span>

                <h2 className="contact-form-title">
                  How can we
                  <span>help you?</span>
                </h2>

                <p className="contact-form-description">
                  Fill in the details below and the clinic team will get back to
                  you. Please do not share detailed medical information here. If
                  your child is unwell today, call the clinic or come during OPD
                  hours.
                </p>
              </div>

              {status === "sent" ? (
                <div className="contact-form-success" role="status">
                  <span className="contact-form-success-icon" aria-hidden="true">
                    ✓
                  </span>

                  <h3>Enquiry received</h3>

                  <p>
                    Thank you. The clinic team will get back to you. If it is
                    urgent, please call {CLINIC.phone}.
                  </p>

                  <button
                    type="button"
                    className="contact-submit-button"
                    onClick={() => setStatus("idle")}
                  >
                    <span>Send another enquiry</span>
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={contactHandleSubmit}>
                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label htmlFor="contact-name">Your name</label>

                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={contactFormData.name}
                        onChange={contactHandleChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="contact-field">
                      <label htmlFor="contact-phone">Mobile number</label>

                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        inputMode="numeric"
                        autoComplete="tel"
                        value={contactFormData.phone}
                        onChange={contactHandleChange}
                        placeholder="10 digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label htmlFor="contact-email">
                        Email address <span>(optional)</span>
                      </label>

                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={contactFormData.email}
                        onChange={contactHandleChange}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="contact-field">
                      <label htmlFor="contact-subject">Subject</label>

                      <select
                        id="contact-subject"
                        name="subject"
                        value={contactFormData.subject}
                        onChange={contactHandleChange}
                        required
                      >
                        <option value="">Select an enquiry</option>

                        {SUBJECTS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="contact-field contact-field-message">
                    <label htmlFor="contact-message">Your message</label>

                    <textarea
                      id="contact-message"
                      name="message"
                      value={contactFormData.message}
                      onChange={contactHandleChange}
                      placeholder="Tell us how we can help"
                      rows="6"
                      required
                    />
                  </div>

                  {status === "error" && (
                    <p className="contact-form-error" role="alert">
                      {errorText}
                    </p>
                  )}

                  <div className="contact-form-footer">
                    <p className="contact-form-note">
                      By submitting this form you are asking the clinic team to
                      contact you.
                    </p>

                    <button
                      type="submit"
                      className="contact-submit-button"
                      disabled={status === "sending"}
                    >
                      <span>
                        {status === "sending" ? "Sending…" : "Send Enquiry"}
                      </span>

                      <span className="contact-submit-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-bottom">
        <div className="contact-container">
          <div className="contact-bottom-inner">
            <div>
              <span className="contact-section-label">Need an appointment?</span>

              <h2 className="contact-bottom-title">
                Book your slot
                <span>in under a minute.</span>
              </h2>
            </div>

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-bottom-button"
            >
              <span>Book an Appointment</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
