import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import HeroSphere3D from "../3d/HeroSphere3D";
import MagneticButton from "../common/MagneticButton";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { agencyData } from "../../data/agencyData";

/**
 * HeroSection
 * Replicates the KOTA London flagship experience:
 * - Huge lowercase grotesque statement typography
 * - Interactive 3D Refractive Glass Sphere embedded directly inside the headline
 * - Top status text "DIGITAL GROWTH AGENCY : 2026" placed in hero flow (scrolls naturally with page)
 * - Strategic positioning statement with bold emphasis
 * - Proof badges strip
 * - Perfectly calibrated 100vh fit on desktop without clipping
 */
export default function HeroSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const eyebrow = section.querySelector(".hero-animate-eyebrow");
        const headlineLines = section.querySelectorAll(".hero-headline-inner");
        const sphere = section.querySelector(".hero-sphere-reveal");
        const divider = section.querySelector(".hero-bottom-divider");
        const description = section.querySelector(".hero-description");
        const buttons = section.querySelectorAll(".hero-cta-group > *");
        const proofLabel = section.querySelector(".hero-proof-label");
        const proofItems = section.querySelectorAll(".hero-proof-item");

        const timeline = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

        // 1. Top eyebrow entrance
        timeline.fromTo(
          eyebrow,
          { y: -20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
          0,
        );

        // 2. Main headline reveal
        timeline.fromTo(
          headlineLines,
          { yPercent: 110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.16,
            ease: "power4.out",
          },
          0.2,
        );

        // 3. 3D sphere entrance
        timeline.fromTo(
          sphere,
          { scale: 0.55, y: 20, autoAlpha: 0 },
          {
            scale: 1,
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "back.out(1.4)",
          },
          0.85,
        );

        // 4. Bottom divider reveal
        timeline.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power2.inOut",
          },
          1.05,
        );

        // 5. Agency description
        timeline.fromTo(
          description,
          { y: 25, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
          },
          1.15,
        );

        // 6. CTA buttons
        timeline.fromTo(
          buttons,
          { y: 20, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.12,
          },
          1.35,
        );

        // 7. Partner credentials
        timeline.fromTo(
          proofLabel,
          { y: 15, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
          },
          1.35,
        );

        timeline.fromTo(
          proofItems,
          { y: 18, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
          },
          1.5,
        );
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={sectionRef} className="hero-section">
      <div className="container hero-container">
        {/* Top Eyebrow Row: Aligned with the logo area at initial load (KOTA London style) */}
        <div className="hero-top-eyebrow hero-animate-eyebrow">
          {/* Status text with left offset so it sits beside the fixed logo at scrollY = 0 */}
          <div className="hero-status-tag">
            <span className="hero-status-dot" />
            <span>DIGITAL GROWTH AGENCY : 2026</span>
          </div>

          {/* Secondary Service Pillars Tag */}
          <span className="badge-pill">
            <Sparkles size={11} color="var(--color-brand-crimson)" />
            Social Media • Creators • Performance Marketing
          </span>
        </div>

        {/* Massive Editorial Headline with Embedded 3D Sphere */}
        <div
          className="hero-headline-wrap"
          style={{
            marginBlock: "auto",
            paddingBlock: "clamp(8px, 1.5vh, 20px)",
          }}
        >
          <h1
            className="text-hero"
            style={{
              color: "var(--color-text-dark)",
              userSelect: "none",
              display: "flex",
              flexDirection: "column",
              lineHeight: 0.9,
              letterSpacing: "var(--tracking-tighter)",
            }}
          >
            <span className="hero-headline-line">
              <span className="hero-headline-inner">ignite</span>
            </span>

            <span className="hero-headline-line">
              <span className="hero-headline-inner">brand</span>
            </span>

            <span className="hero-headline-line">
              <span
                className="hero-headline-inner"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "clamp(6px, 1.2vw, 16px)",
                }}
              >
                vel
                <span className="hero-sphere-reveal">
                  <HeroSphere3D size={110} />
                </span>
                city
              </span>
            </span>
          </h1>
        </div>

        {/* Bottom Row: Trust/Proof Badges & Strategic Positioning */}
        {/* Bottom Row: Trust/Proof Badges & Strategic Positioning */}
        <div className="hero-bottom-wrapper">
          {/* Animated Divider */}
          <div className="hero-bottom-divider" />

          <div className="hero-bottom-content">
            {/* Left: Verified Partner Credentials Strip */}
            <div>
              <p
                className="hero-proof-label"
                style={{
                  fontSize: "var(--text-micro)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-wider)",
                  color: "var(--color-text-dark-muted)",
                  marginBottom: "10px",
                  fontWeight: 600,
                }}
              >
                Industry Credentials & Growth Network
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                {agencyData.proofLogos.map((badge) => (
                  <div
                    key={badge.name}
                    className="hero-proof-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "var(--radius-card-sm)",
                      backgroundColor: "rgba(255, 255, 255, 0.75)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid var(--border-light-subtle)",
                      fontSize: "var(--text-small)",
                      fontWeight: 700,
                      color: "var(--color-text-dark)",
                      boxShadow: "var(--shadow-subtle)",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "var(--color-brand-crimson)",
                      }}
                    />
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Agency Statement & CTA Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <p
                className="hero-description"
                style={{
                  fontSize: "clamp(0.95rem, 1.15vw, 1.25rem)",
                  lineHeight: 1.45,
                  color: "var(--color-text-dark)",
                  fontWeight: 500,
                }}
              >
                A premier digital growth studio where{" "}
                <strong>strategic-thinkers</strong> turn social media, creator
                storytelling, and paid acquisition into{" "}
                <strong>exponential brand momentum</strong>.
              </p>

              <div
                className="hero-cta-group"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                }}
              >
                <MagneticButton
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#services")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  variant="outline"
                  style={{ padding: "10px 22px" }}
                >
                  Our Services <ArrowUpRight size={17} />
                </MagneticButton>

                <MagneticButton
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    backgroundColor: "var(--color-brand-crimson)",
                    color: "#ffffff",
                    padding: "10px 22px",
                  }}
                >
                  Book Discovery Call <ArrowUpRight size={17} />
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
