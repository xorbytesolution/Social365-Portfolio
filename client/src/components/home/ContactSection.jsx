import React, { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ContactSection.css";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const formRef = useRef(null);
  const connectorRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Respect reduced-motion preferences
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      // 1. Draw the connecting SVG line on scroll
      const path = connectorRef.current;

      if (path) {
        const pathLength = path.getTotalLength();

        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top 35%",
            scrub: 1,
          },
        });
      }

      // 2. Reveal the heading content
      if (introRef.current) {
        gsap.fromTo(
          introRef.current.children,
          {
            y: 40,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              once: true,
            },
          },
        );
      }

      // 3. Reveal the contact form
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          {
            x: 45,
            autoAlpha: 0,
          },
          {
            x: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              once: true,
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend/email integration will be added later.
  };

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      {/* Animated connecting line */}
      <svg
        className="contact-connector"
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={connectorRef}
          d="M 120 0 C 170 80, 280 45, 390 130 S 570 190, 650 250"
          fill="none"
          stroke="#ed2445"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="contact-container">
        <div className="contact-intro" ref={introRef}>
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

        <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
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
