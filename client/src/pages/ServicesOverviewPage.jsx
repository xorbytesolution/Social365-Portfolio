import React from "react";
import { Link } from "react-router-dom";
import { servicesData } from "../data/servicesData";
import MagneticButton from "../components/common/MagneticButton";
import { ArrowUpRight, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

/**
 * ServicesOverviewPage
 * Dedicated hub at /services displaying all 3 capabilities with links to individual service pages.
 */
export default function ServicesOverviewPage() {
  return (
    <div
      className="services-overview-page section-padding"
      style={{
        position: "relative",
        zIndex: "var(--z-content-base)",
        paddingTop: "clamp(120px, 14vh, 160px)",
      }}
    >
      <div className="container">
        {/* Page Headline */}
        <div style={{ marginBottom: "clamp(48px, 7vw, 80px)" }}>
          <div style={{ marginBottom: "16px" }}>
            <span className="badge-pill">
              <Sparkles size={12} color="var(--color-brand-crimson)" />
              Agency Capabilities • 01 — 03
            </span>
          </div>

          <h1
            className="text-display"
            style={{
              color: "var(--color-text-dark)",
              letterSpacing: "var(--tracking-tighter)",
              lineHeight: 0.95,
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            OUR
            <br />
            SERVICES
          </h1>

          <p
            style={{
              fontSize: "clamp(1.15rem, 1.5vw, 1.5rem)",
              lineHeight: 1.6,
              color: "var(--color-text-dark-muted)",
              maxWidth: "750px",
            }}
          >
            We engineer unfair competitive advantages through strategic social media, creator storytelling, and high-performance commercial momentum. Each capability operates standalone or harmonized as an integrated growth engine.
          </p>
        </div>

        {/* 3 Services Cards Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(32px, 5vw, 64px)", marginBottom: "clamp(60px, 8vw, 100px)" }}>
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="kota-service-card"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "var(--radius-leaf-card)",
                boxShadow: "var(--shadow-elevated)",
                border: "1px solid var(--border-light-subtle)",
                padding: "clamp(28px, 4.5vw, 56px)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "clamp(32px, 4vw, 64px)",
                alignItems: "center",
              }}
            >
              {/* Left Column */}
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-small)",
                    fontWeight: 700,
                    color: "var(--color-brand-crimson)",
                    letterSpacing: "var(--tracking-wide)",
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  {service.stepNumber}
                </span>

                <h2
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(2rem, 3.4vw, 3.4rem)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: "var(--tracking-tight)",
                    color: "var(--color-text-dark)",
                    marginBottom: "16px",
                  }}
                >
                  {service.title}
                </h2>

                <p
                  style={{
                    fontSize: "clamp(1.05rem, 1.2vw, 1.25rem)",
                    lineHeight: 1.6,
                    color: "var(--color-text-dark-muted)",
                    marginBottom: "24px",
                  }}
                >
                  {service.description}
                </p>

                {/* Capability Pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge-pill"
                      style={{
                        backgroundColor: "rgba(247, 248, 250, 0.95)",
                        borderColor: "var(--border-light-medium)",
                        color: "var(--color-text-dark)",
                        fontSize: "var(--text-micro)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <MagneticButton
                  to={`/services/${service.id}`}
                  onClick={() => {
                    if (window.__lenis) {
                      window.__lenis.scrollTo(0, { immediate: true });
                    }
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                  }}
                  style={{
                    backgroundColor: "var(--color-text-dark)",
                    color: "#ffffff",
                    padding: "12px 28px",
                  }}
                >
                  Explore Detailed Scope <ArrowUpRight size={18} />
                </MagneticButton>
              </div>

              {/* Right Column Highlights Plate */}
              <div
                style={{
                  backgroundColor: "rgba(247, 248, 250, 0.9)",
                  borderRadius: "var(--radius-card-md)",
                  padding: "clamp(24px, 3.5vw, 40px)",
                  border: "1px solid var(--border-light-medium)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(1.2rem, 1.6vw, 1.5rem)",
                    fontWeight: 700,
                    color: "var(--color-text-dark)",
                    marginBottom: "18px",
                  }}
                >
                  Core Deliverables
                </h3>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
                  {service.deliverables.slice(0, 4).map((d, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "var(--text-small)", color: "var(--color-text-dark)" }}>
                      <CheckCircle2 size={18} color="var(--color-brand-crimson)" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "12px",
                    borderTop: "1px solid var(--border-light-subtle)",
                    paddingTop: "16px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem, 3.2vw, 2.8rem)",
                      fontWeight: 800,
                      color: service.mockup.accentColor,
                    }}
                  >
                    {service.mockup.statPrimary}
                  </span>
                  <span style={{ fontSize: "var(--text-small)", fontWeight: 600, color: "var(--color-text-dark-muted)" }}>
                    {service.mockup.statLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div
          style={{
            padding: "clamp(36px, 5vw, 60px)",
            backgroundColor: "#090a0f",
            borderRadius: "var(--radius-leaf-card)",
            color: "var(--color-text-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "28px",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-micro)",
                letterSpacing: "var(--tracking-wider)",
                color: "var(--color-brand-salmon)",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Custom Growth Strategy
            </span>
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1.8rem, 2.6vw, 2.6rem)",
                fontWeight: 800,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Need an integrated full-funnel solution?
            </h3>
          </div>

          <MagneticButton
            href="/#contact"
            style={{
              backgroundColor: "var(--color-brand-crimson)",
              color: "#ffffff",
              padding: "14px 32px",
            }}
          >
            Let's Talk <ArrowRight size={18} />
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}

