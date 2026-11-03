import React from "react";
import { ArrowUpRight } from "lucide-react";
import "./ContactSection.css";

export default function ContactSection() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission will be connected to the backend/email service later.
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-intro">
          <span className="contact-eyebrow">
            <span className="contact-dot" />
            GET IN TOUCH
          </span>

          <h2>
            Let's
            <br />
            Talk<span>.</span>
          </h2>

          <p>
            Have a project, collaboration, or idea in mind? Tell us about it —
            we'd love to be part of your next big move.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-fields">
            <div className="contact-field">
              <label htmlFor="contact-name">
                Your Name <span>*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-email">
                Your Email <span>*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-company">Company / Brand</label>
              <input
                id="contact-company"
                name="company"
                type="text"
                placeholder="Enter company or brand name"
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-service">
                Service Interested In <span>*</span>
              </label>
              <select
                id="contact-service"
                name="service"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select a service
                </option>
                <option>Social Media Management</option>
                <option>Influencer Marketing</option>
                <option>Performance Marketing</option>
                <option>Multiple Services</option>
                <option>Other / Not Sure Yet</option>
              </select>
            </div>

            <div className="contact-field contact-field--message">
              <label htmlFor="contact-message">
                Your Message <span>*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell us about your project, goals, or idea..."
                required
              />
            </div>
          </div>

          <button className="contact-submit" type="submit">
            Send Message <ArrowUpRight size={21} />
          </button>
        </form>
      </div>
    </section>
  );
}
