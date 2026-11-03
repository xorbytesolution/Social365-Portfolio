import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { agencyData } from "../../data/agencyData";

/**
 * Footer Component
 * Solid black editorial footer matching the UI reference:
 * - Brand positioning statement & dark-mode logo
 * - Quick Links navigation
 * - Services deep-dive links
 * - Stay Connected social channels
 * - Bottom legal & copyright row
 */
export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (e, href) => {
    e.preventDefault();

    if (href.startsWith("/#")) {
      const hash = href.replace("/", "");
      if (location.pathname === "/") {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate(href);
      }
    } else if (href === "/") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } else {
      navigate(href);
    }
  };

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/#about" },
    { label: "Our Work", href: "/#work" },
    { label: "Our Process", href: "/#process" },
    { label: "Let's Talk", href: "/#contact" },
  ];

  const serviceLinks = [
    { label: "Social Media Management", href: "/services/social-media-management" },
    { label: "Influencer Marketing", href: "/services/influencer-marketing" },
    { label: "Performance Marketing", href: "/services/digital-marketing" },
    { label: "Content Creation", href: "/services/social-media-management" },
    { label: "Brand Strategy", href: "/services/digital-marketing" },
  ];

  return (
    <footer
      style={{
        position: "relative",
        zIndex: "var(--z-content-base)",
        backgroundColor: "#07080c",
        color: "#ffffff",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        paddingTop: "clamp(64px, 8vw, 100px)",
        paddingBottom: "clamp(32px, 4vw, 44px)",
      }}
    >
      <div className="container">
        {/* Main 4-Column Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(36px, 5vw, 64px)",
            paddingBottom: "clamp(48px, 6vw, 80px)",
          }}
        >
          {/* Column 1: Brand & Strategic Mission */}
          <div style={{ maxWidth: "340px" }}>
            <Link
              to="/"
              onClick={(e) => handleLinkClick(e, "/")}
              style={{
                display: "inline-block",
                textDecoration: "none",
              }}
              aria-label="Social365 Home"
            >
              <img
                src="/logo.jpeg"
                alt="Social365"
                style={{
                  height: "clamp(36px, 4vw, 48px)",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Link>

            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1.35rem, 1.75vw, 1.75rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.25,
                marginTop: "24px",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
              }}
            >
              Strategic marketing.
              <br />
              Real brand growth.
            </h3>

            <p
              style={{
                fontSize: "var(--text-small)",
                lineHeight: 1.65,
                color: "rgba(255, 255, 255, 0.55)",
                margin: 0,
              }}
            >
              We help brands grow through creative strategy, powerful content and data-driven digital marketing.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-micro)",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Quick Links
            </h4>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px", padding: 0, margin: 0 }}>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    style={{
                      fontSize: "var(--text-small)",
                      color: "rgba(255, 255, 255, 0.72)",
                      textDecoration: "none",
                      display: "inline-block",
                      transition: "color 0.25s ease, transform 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.72)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-micro)",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Services
            </h4>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px", padding: 0, margin: 0 }}>
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    style={{
                      fontSize: "var(--text-small)",
                      color: "rgba(255, 255, 255, 0.72)",
                      textDecoration: "none",
                      display: "inline-block",
                      transition: "color 0.25s ease, transform 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.72)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stay Connected & Social Pills */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-micro)",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Stay Connected
            </h4>

            <p
              style={{
                fontSize: "var(--text-small)",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.55)",
                marginBottom: "24px",
              }}
            >
              Follow us for the latest updates, insights and creative work.
            </p>

            {/* Circular Social Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {[
                {
                  label: "Instagram",
                  url: agencyData.socials?.find((s) => s.name === "Instagram")?.url || "https://instagram.com",
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  url: agencyData.socials?.find((s) => s.name === "LinkedIn")?.url || "https://linkedin.com",
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                },
                {
                  label: "X (formerly Twitter)",
                  url: agencyData.socials?.find((s) => s.name?.includes("X") || s.name?.includes("Twitter"))?.url || "https://x.com",
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: "YouTube",
                  url: agencyData.socials?.find((s) => s.name === "YouTube")?.url || "https://youtube.com",
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#07080c" />
                    </svg>
                  ),
                },
              ].map(({ label, url, icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255, 255, 255, 0.85)",
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-brand-crimson)";
                    e.currentTarget.style.borderColor = "var(--color-brand-crimson)";
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Divider */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "var(--text-micro)",
            color: "rgba(255, 255, 255, 0.45)",
          }}
        >
          <div>
            © 2026 Social365. All rights reserved.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              style={{
                color: "rgba(255, 255, 255, 0.45)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.45)")}
            >
              Privacy Policy
            </a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              style={{
                color: "rgba(255, 255, 255, 0.45)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.45)")}
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

