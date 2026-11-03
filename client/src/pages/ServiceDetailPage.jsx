import React, { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { useParams, Link, Navigate } from "react-router-dom";
import { servicesData } from "../data/servicesData";
import MagneticButton from "../components/common/MagneticButton";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  ChevronDown,
} from "lucide-react";
import { usePageTransition } from "../components/transitions/PageTransition";

/**
 * ServiceDetailPage
 * Dedicated deep-dive page for individual Social365 services:
 * - /services/social-media-management
 * - /services/influencer-marketing
 * - /services/digital-marketing
 */
export default function ServiceDetailPage({ serviceId }) {
  const params = useParams();
  const currentId = serviceId || params.id;
  const [openFaq, setOpenFaq] = useState(null);
  const pageRef = useRef(null);
  const { registerPageEntrance, shouldWaitForReveal } = usePageTransition();

  // Find matching service from dataset
  const serviceIndex = servicesData.findIndex(
    (s) => s.id === currentId || s.slug === currentId,
  );
  const service = servicesData[serviceIndex];

  // If invalid service ID, redirect back to home services deck
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Next service for the bottom discovery bar
  const nextService = servicesData[(serviceIndex + 1) % servicesData.length];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useLayoutEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentId]);

  useLayoutEffect(() => {
    if (!service || !pageRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    let unregisterEntrance;

    const ctx = gsap.context(() => {
      // Create the animation in a paused state
      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          ".detail-animate-back",
          {
            y: 15,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
          },
        )
        .fromTo(
          ".detail-hero-item",
          {
            y: 35,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.3",
        )
        .fromTo(
          ".detail-animate-panel",
          {
            y: 40,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.15,
          },
          "-=0.3",
        )
        .fromTo(
          ".detail-animate-faq",
          {
            y: 30,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
          },
          "-=0.2",
        )
        .fromTo(
          ".detail-animate-next",
          {
            y: 35,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
          },
          "-=0.2",
        );

      // Wait for the overlay reveal when navigating between pages
      if (shouldWaitForReveal) {
        unregisterEntrance = registerPageEntrance(() => {
          timeline.play(0);
        });
      } else {
        // Play immediately on direct page load
        timeline.play(0);
      }
    }, pageRef);

    return () => {
      unregisterEntrance?.();
      ctx.revert();
    };
  }, [currentId, service, shouldWaitForReveal, registerPageEntrance]);

  return (
    <div
      ref={pageRef}
      className="service-detail-page section-padding"
      style={{
        position: "relative",
        zIndex: "var(--z-content-base)",
        paddingTop: "clamp(120px, 14vh, 160px)",
      }}
    >
      <div className="container">
        {/* Breadcrumb & Navigation Back */}
        <div
          className="detail-animate-back"
          style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}
        >
          <Link
            to="/#services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "var(--text-small)",
              fontWeight: 700,
              color: "var(--color-text-dark-muted)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-brand-crimson)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-dark-muted)")
            }
          >
            <ArrowLeft size={16} /> Back to All Services
          </Link>
        </div>

        {/* 1. Header Hero Banner */}
        <div style={{ marginBottom: "clamp(40px, 6vw, 70px)" }}>
          <div style={{ marginBottom: "16px" }}>
            <span className="badge-pill">
              <Sparkles size={12} color="var(--color-brand-crimson)" />
              Service {service.stepNumber} • Enterprise Capability
            </span>
          </div>

          <h1
            className="text-display detail-hero-item"
            style={{
              color: "var(--color-text-dark)",
              lineHeight: 1.02,
              letterSpacing: "var(--tracking-tighter)",
              marginBottom: "24px",
            }}
          >
            {service.title}
          </h1>

          <p
            className="detail-hero-item"
            style={{
              fontSize: "clamp(1.2rem, 1.8vw, 1.65rem)",
              lineHeight: 1.45,
              fontWeight: 600,
              color: "var(--color-brand-crimson)",
              maxWidth: "850px",
              marginBottom: "20px",
            }}
          >
            {service.tagline}
          </p>

          <p
            className="detail-hero-item"
            style={{
              fontSize: "clamp(1.05rem, 1.25vw, 1.35rem)",
              lineHeight: 1.65,
              color: "var(--color-text-dark-muted)",
              maxWidth: "850px",
            }}
          >
            {service.longDescription || service.description}
          </p>
        </div>

        {/* 2. Main Two-Column Service Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(36px, 5vw, 70px)",
            alignItems: "start",
            marginBottom: "clamp(60px, 8vw, 100px)",
          }}
        >
          {/* Left Column: Scope & Detailed Deliverables */}
          <div
            className="kota-service-card detail-animate-panel"
            style={{
              padding: "clamp(28px, 4vw, 48px)",
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-card-md)",
              boxShadow: "var(--shadow-medium)",
              border: "1px solid var(--border-light-subtle)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1.5rem, 2.2vw, 2.1rem)",
                fontWeight: 800,
                color: "var(--color-text-dark)",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              What's Included
            </h2>

            {/* Capability Pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "28px",
              }}
            >
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="badge-pill"
                  style={{
                    backgroundColor: "rgba(247, 248, 250, 0.95)",
                    borderColor: "var(--border-light-medium)",
                    color: "var(--color-text-dark)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Deliverables Checklist */}
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {service.deliverables.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    fontSize: "var(--text-body)",
                    lineHeight: 1.55,
                    color: "var(--color-text-dark)",
                  }}
                >
                  <CheckCircle2
                    size={20}
                    color="var(--color-brand-crimson)"
                    style={{ flexShrink: 0, marginTop: "2px" }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Ideal For Callout */}
            {service.idealFor && (
              <div
                style={{
                  marginTop: "32px",
                  padding: "20px 24px",
                  borderRadius: "var(--radius-card-sm)",
                  backgroundColor: "rgba(247, 248, 250, 0.9)",
                  borderLeft: "4px solid var(--color-brand-crimson)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-micro)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--tracking-wider)",
                    color: "var(--color-text-dark-muted)",
                    marginBottom: "6px",
                  }}
                >
                  Ideal For
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-small)",
                    fontWeight: 600,
                    color: "var(--color-text-dark)",
                  }}
                >
                  {service.idealFor}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Arched Mockup Plate + Live Performance Display */}
          <div
            className="detail-animate-panel"
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: "#090a0f",
              borderRadius:
                "clamp(24px, 4vw, 36px) clamp(60px, 9vw, 120px) clamp(24px, 4vw, 36px) clamp(24px, 4vw, 36px)",
              overflow: "hidden",
              padding: "clamp(28px, 4vw, 48px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "var(--shadow-dark-card)",
              minHeight: "440px",
            }}
          >
            {/* Top Indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "32px",
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
                PROVEN RESULTS
              </span>
            </div>

            {/* Center Stat Card */}
            <div
              style={{
                borderRadius: "var(--radius-card-md)",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "clamp(24px, 3.5vw, 40px)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                marginBottom: "32px",
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
                {serviceIndex === 0 && (
                  <Video size={32} color="var(--color-brand-crimson)" />
                )}
                {serviceIndex === 1 && (
                  <Users size={32} color="var(--color-brand-salmon)" />
                )}
                {serviceIndex === 2 && <TrendingUp size={32} color="#64dfdf" />}

                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-micro)",
                    color: "var(--color-text-light-muted)",
                  }}
                >
                  LIVE TRAJECTORY
                </span>
              </div>

              <h3
                style={{
                  fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "6px",
                }}
              >
                {service.mockup.cardTitle}
              </h3>
              <p
                style={{
                  fontSize: "var(--text-small)",
                  color: "var(--color-text-light-muted)",
                  marginBottom: "20px",
                }}
              >
                {service.mockup.cardSub}
              </p>

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
                    fontSize: "clamp(2.8rem, 4.5vw, 4rem)",
                    fontWeight: 800,
                    lineHeight: 1,
                    color: service.mockup.accentColor,
                  }}
                >
                  {service.mockup.statPrimary}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-body)",
                    fontWeight: 600,
                    color: "var(--color-text-light)",
                  }}
                >
                  {service.mockup.statLabel}
                </span>
              </div>
            </div>

            {/* Bottom Inquire CTA */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "var(--text-small)",
                  color: "var(--color-text-light-muted)",
                }}
              >
                Ready to deploy this service?
              </span>
              <MagneticButton
                href="/#contact"
                style={{
                  backgroundColor: "var(--color-brand-crimson)",
                  color: "#ffffff",
                  padding: "10px 22px",
                  fontSize: "var(--text-small)",
                }}
              >
                Book Discovery Call <ArrowUpRight size={16} />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* 3. Frequently Asked Questions Accordion */}
        {service.faqs && service.faqs.length > 0 && (
          <div
            className="detail-animate-faq"
            style={{ marginBottom: "clamp(60px, 8vw, 100px)" }}
          >
            <div style={{ marginBottom: "32px" }}>
              <span className="badge-pill">
                <HelpCircle size={12} color="var(--color-brand-crimson)" />
                Common Inquiries
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)",
                  fontWeight: 800,
                  color: "var(--color-text-dark)",
                  marginTop: "12px",
                }}
              >
                Service FAQs
              </h2>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "var(--radius-card-sm)",
                      border: "1px solid var(--border-light-subtle)",
                      boxShadow: "var(--shadow-subtle)",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      style={{
                        width: "100%",
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        textAlign: "left",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "var(--text-body)",
                        color: "var(--color-text-dark)",
                      }}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={20}
                        color="var(--color-brand-crimson)"
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                          flexShrink: 0,
                          marginLeft: "16px",
                        }}
                      />
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          padding: "0 24px 24px 24px",
                          fontSize: "var(--text-body)",
                          lineHeight: 1.6,
                          color: "var(--color-text-dark-muted)",
                          borderTop: "1px solid var(--border-light-subtle)",
                          paddingTop: "16px",
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Bottom Next Service Discovery Banner */}
        <div
          className="detail-animate-next"
          style={{
            padding: "clamp(32px, 5vw, 48px)",
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-leaf-card)",
            boxShadow: "var(--shadow-medium)",
            border: "1px solid var(--border-light-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-micro)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wider)",
                color: "var(--color-brand-crimson)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Next Capability • {nextService.number}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1.6rem, 2.4vw, 2.4rem)",
                fontWeight: 800,
                color: "var(--color-text-dark)",
                margin: 0,
              }}
            >
              {nextService.title}
            </h3>
          </div>

          <MagneticButton
            to={`/services/${nextService.id}`}
            onClick={() => {
              if (window.__lenis) {
                window.__lenis.scrollTo(0, { immediate: true });
              }
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }}
            style={{
              padding: "12px 28px",
              backgroundColor: "var(--color-text-dark)",
              color: "#ffffff",
            }}
          >
            Explore Next Service <ArrowRight size={18} />
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
