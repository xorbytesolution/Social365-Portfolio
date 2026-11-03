import React, { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "../common/MagneticButton";
import { ArrowUpRight, Sparkles, TrendingUp, Users, Video } from "lucide-react";
import { servicesData } from "../../data/servicesData";

gsap.registerPlugin(ScrollTrigger);

/**
 * ServiceMockupCanvas
 * Right-hand 3D dark arched container with interactive mouse perspective tilt
 */
function ServiceMockupCanvas({ service, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = -((y - centerY) / centerY) * 10;
    const tiltY = ((x - centerX) / centerX) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "clamp(360px, 46vh, 520px)",
        backgroundColor: "#090a0f",
        borderRadius:
          "clamp(24px, 3.5vw, 36px) clamp(60px, 9vw, 110px) clamp(24px, 3.5vw, 36px) clamp(24px, 3.5vw, 36px)",
        overflow: "hidden",
        padding: "clamp(22px, 3.2vw, 40px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "var(--shadow-dark-card)",
        perspective: "1200px",
        boxSizing: "border-box",
      }}
    >
      {/* Background Aurora Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: "-25%",
          right: "-20%",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${service.mockup.accentColor} 0%, transparent 70%)`,
          opacity: 0.35,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Status Tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border-dark-subtle)",
            color: "var(--color-text-light)",
            fontSize: "var(--text-micro)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: service.mockup.accentColor,
              boxShadow: `0 0 10px ${service.mockup.accentColor}`,
            }}
          />
          {service.mockup.badge}
        </div>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-micro)",
            color: "var(--color-text-light-muted)",
          }}
        >
          SYSTEM // 365
        </span>
      </div>

      {/* 3D Multi-Layered Floating Card (Tilted with mouse) */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition:
            tilt.x === 0 && tilt.y === 0
              ? "transform 0.5s var(--ease-expo)"
              : "transform 0.08s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            borderRadius: "var(--radius-card-md)",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "clamp(20px, 2.8vw, 34px)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
            transform: "translateZ(24px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            {index === 0 && (
              <Video size={28} color="var(--color-brand-crimson)" />
            )}
            {index === 1 && (
              <Users size={28} color="var(--color-brand-salmon)" />
            )}
            {index === 2 && <TrendingUp size={28} color="#64dfdf" />}

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-micro)",
                color: "var(--color-text-light-muted)",
              }}
            >
              LIVE ENGAGEMENT
            </span>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h4
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1.4rem, 2vw, 1.85rem)",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "4px",
              }}
            >
              {service.mockup.cardTitle}
            </h4>
            <p
              style={{
                fontSize: "var(--text-small)",
                color: "var(--color-text-light-muted)",
              }}
            >
              {service.mockup.cardSub}
            </p>
          </div>

          {/* Big Metric Display */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: "16px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.4rem, 3.8vw, 3.4rem)",
                fontWeight: 800,
                lineHeight: 1,
                color: service.mockup.accentColor,
              }}
            >
              {service.mockup.statPrimary}
            </span>
            <span
              style={{
                fontSize: "var(--text-small)",
                fontWeight: 600,
                color: "var(--color-text-light)",
              }}
            >
              {service.mockup.statLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Status Ribbon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "var(--tracking-wide)",
            color: "var(--color-text-light-muted)",
          }}
        >
          {service.mockup.secondaryBadge}
        </span>

        <div style={{ display: "flex", gap: "6px" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: i === index ? "20px" : "6px",
                height: "6px",
                borderRadius: "var(--radius-full)",
                backgroundColor:
                  i === index
                    ? service.mockup.accentColor
                    : "rgba(255, 255, 255, 0.2)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ServicesDeck Component
 * Replicates the KOTA London ScrollTrigger Card-Stacking Experience:
 * - Natural scroll exit for "OUR SERVICES" header
 * - Pinned deck positioned dead center in the viewport (height: 80-82vh)
 * - Large, prominent, consistent card typography matching Image 4 reference
 * - Card 01 pins, Card 02 slides up over Card 01 with scaling/dimming
 * - Card 03 slides up over Card 02 with scaling/dimming
 * - Persistent "Start your project ↗" magnetic CTA
 */
export default function ServicesDeck() {
  const pinWrapRef = useRef(null);
  const cardsRef = useRef([]);

  // Curated title line breaks and punchy tags for consistent editorial balance (matching Image 4)
  const cardDataFormatted = [
    {
      titleLines: ["Social Media", "Management"],
      primaryTags: ["Social Strategy", "Content Calendars", "Short-Form Reels"],
    },
    {
      titleLines: ["Influencer", "Marketing"],
      primaryTags: [
        "Creator Selection & Vetting",
        "Campaign Strategy",
        "Seeding & Activations",
      ],
    },
    {
      titleLines: ["Digital Marketing", "& Paid Ads"],
      primaryTags: [
        "Meta & Google Ads",
        "Full-Funnel Strategy",
        "Conversion Optimization (CRO)",
      ],
    },
  ];

  useLayoutEffect(() => {
    const pinWrap = pinWrapRef.current;
    if (!pinWrap) return;

    // Use GSAP MatchMedia for clean responsive behavior
    const mm = gsap.matchMedia();

    mm.add("(min-width: 900px)", () => {
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length < 3) return;

      // Card 0 starts visible and active
      // Card 1 and Card 2 wait below the viewport
      gsap.set(cards[0], {
        yPercent: 0,
        scale: 1,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
      });
      gsap.set(cards[1], {
        yPercent: 115,
        scale: 1,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
      });
      gsap.set(cards[2], {
        yPercent: 115,
        scale: 1,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrap,
          start: "top top+=85", // Pins right below the fixed floating navbar
          end: "+=2400", // Scroll runway for smooth 3-card stack
          pin: true,
          scrub: 0.8, // Silky momentum scrub
          anticipatePin: 1,
        },
      });

      // Step 1: Card 1 slides UP from bottom to stack on top of Card 0
      // Card 0 dims and scales down slightly
      tl.to(
        cards[0],
        {
          scale: 0.94,
          opacity: 0.3,
          filter: "brightness(0.85) blur(1px)",
          duration: 1.1,
          ease: "power2.inOut",
        },
        0.2,
      );

      tl.to(
        cards[1],
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power2.inOut",
        },
        0.2,
      );

      // Step 2: Card 2 slides UP from bottom to stack on top of Card 1
      // Card 1 dims and scales down slightly
      tl.to(
        cards[1],
        {
          scale: 0.94,
          opacity: 0.3,
          filter: "brightness(0.85) blur(1px)",
          duration: 1.1,
          ease: "power2.inOut",
        },
        1.5,
      );

      tl.to(
        cards[2],
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power2.inOut",
        },
        1.5,
      );

      // Buffer pause before unpinning
      tl.to({}, { duration: 0.3 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="services" className="services-deck-section">
      {/* ==========================================================================
          1. Editorial Section Header (Scrolls naturally out of view)
          Matches Reference Image 2 & KOTA London benchmark
         ========================================================================== */}
      <div className="container services-header-container">
        <div className="services-header-row">
          <div>
            {/* <div style={{ marginBottom: "14px" }}>
              <span className="badge-pill">
                <Sparkles size={12} color="var(--color-brand-crimson)" />
                Capabilities & Scope • 01 — 03
              </span>
            </div> */}

            <h2 className="services-title">
              OUR
              <br />
              SERVICES
            </h2>
          </div>

          {/* Directional Downward-Left Arrow (Matching Image 2 Reference) */}
          <div className="services-arrow-wrap">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="services-arrow-svg"
              aria-hidden="true"
            >
              <line x1="56" y1="8" x2="12" y2="52" />
              <polyline points="12 24 12 52 40 52" />
            </svg>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          2. The Pinned Cards Stage Wrapper (Pins in the center of the viewport)
          Cards fill ~80-82vh with generous luxury borders matching Image 4
         ========================================================================== */}
      <div ref={pinWrapRef} className="services-pin-wrapper">
        <div className="container services-stage-container">
          <div className="services-cards-stage">
            {servicesData.map((service, index) => {
              const formatted = cardDataFormatted[index] || {
                titleLines: [service.title],
                primaryTags: service.tags.slice(0, 3),
              };

              return (
                <div
                  key={service.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="stack-card"
                  style={{ zIndex: index + 1 }}
                >
                  <div className="stack-card-inner">
                    {/* ---------------- Left Column: Details & Narrative ---------------- */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "22px",
                      }}
                    >
                      {/* Step Counter */}
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-body)",
                          fontWeight: 700,
                          color: "var(--color-brand-crimson)",
                          letterSpacing: "var(--tracking-wider)",
                        }}
                      >
                        {service.stepNumber}
                      </div>

                      {/* Prominent Multi-line Title matching Image 4 */}
                      <h3 className="service-card-title">
                        {formatted.titleLines.map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < formatted.titleLines.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h3>

                      {/* 3 Clean Primary Capability Pills */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        {formatted.primaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="badge-pill"
                            style={{
                              backgroundColor: "rgba(247, 248, 250, 0.95)",
                              borderColor: "var(--border-light-medium)",
                              color: "var(--color-text-dark)",
                              padding: "8px 18px",
                              fontSize: "var(--text-small)",
                              fontWeight: 600,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Editorial Narrative */}
                      <p
                        style={{
                          fontSize: "clamp(1.05rem, 1.25vw, 1.35rem)",
                          lineHeight: 1.6,
                          color: "var(--color-text-dark-muted)",
                          fontWeight: 400,
                          maxWidth: "520px",
                          margin: 0,
                        }}
                      >
                        {service.description}
                      </p>

                      {/* Action Link -> Navigates to individual Service Detail Page */}
                      <div style={{ paddingTop: "8px" }}>
                        <MagneticButton
                          to={`/services/${service.id}`}
                          variant="outline"
                          style={{
                            padding: "12px 28px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "var(--text-body)",
                          }}
                        >
                          Find out more <ArrowUpRight size={18} />
                        </MagneticButton>
                      </div>
                    </div>

                    {/* ---------------- Right Column: Arched Dark 3D Tilt Mockup ---------------- */}
                    <ServiceMockupCanvas service={service} index={index} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
