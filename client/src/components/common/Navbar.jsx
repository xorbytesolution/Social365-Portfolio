import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { usePageTransition } from "../transitions/PageTransition";
import MagneticButton from "./MagneticButton";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { agencyData } from "../../data/agencyData";

/**
 * Navbar
 * Inspired directly by KOTA London:
 * - Minimalist floating header
 * - Agency status badge
 * - Magnetic "Let's Talk ↗" pill CTA
 * - Dual-line animated menu trigger
 * - Fullscreen luxury editorial navigation drawer
 * - Seamless support for React Router multi-page routing + anchor scrolling
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { transitionTo } = usePageTransition();

  // Prevent background scrolling when menu drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Handle hash scrolling when navigating back to "/"
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const navLinks = [
    { number: "01", label: "Home", href: "/" },
    { number: "02", label: "Services", href: "/services" },
    { number: "03", label: "About Us", href: "/#about" },
    { number: "04", label: "Our Work", href: "/#work" },
    { number: "05", label: "Our Process", href: "/#process" },
    { number: "06", label: "Let's Talk", href: "/#contact" },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (href.startsWith("/#")) {
      const hash = href.replace("/", "");

      if (location.pathname === "/") {
        const target = document.querySelector(hash);

        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        transitionTo(href);
      }
    } else if (href === "/") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        transitionTo("/");
      }
    } else {
      transitionTo(href);
    }
  };

  return (
    <>
      <header
        className="site-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: "var(--z-header)",
          padding: "clamp(18px, 2.5vw, 28px) clamp(20px, 4.5vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "transparent",
          pointerEvents: "none",
        }}
      >
        {/* Left: Brand Logo (Transparent Fixed Anchor) */}
        <div style={{ pointerEvents: "auto" }}>
          <Link
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                e.preventDefault();
                transitionTo("/");
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
            aria-label="Social365 Home"
          >
            <img
              src="/assets/logo.jpeg"
              alt="Social365 Logo"
              style={{
                height: "clamp(28px, 3.2vw, 38px)",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>

        {/* Right: "Let's Talk" CTA + Hamburger Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            pointerEvents: "auto",
          }}
        >
          <MagneticButton
            href="#contact"
            onClick={(e) => handleLinkClick(e, "/#contact")}
            style={{
              padding: "10px 24px",
              fontSize: "var(--text-small)",
              backgroundColor: "var(--color-text-dark)",
              color: "#ffffff",
            }}
          >
            Let's Talk <ArrowUpRight size={16} />
          </MagneticButton>

          {/* Menu Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close Menu" : "Open Navigation"}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: isMenuOpen
                ? "var(--color-brand-crimson)"
                : "var(--color-bg-light-surface)",
              border: "1.5px solid var(--border-light-medium)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isMenuOpen ? "#ffffff" : "var(--color-text-dark)",
              boxShadow: "var(--shadow-subtle)",
              cursor: "pointer",
              transition: "all 0.3s var(--ease-spring)",
            }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Luxury Fullscreen Navigation Drawer */}
      <div
        className={`nav-drawer ${isMenuOpen ? "drawer-active" : ""}`}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: "calc(var(--z-header) - 1)",
          backgroundColor: "rgba(9, 10, 15, 0.98)",
          backdropFilter: "blur(32px)",
          color: "var(--color-text-light)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          overflowY: "auto",
          paddingTop: "clamp(90px, 12vh, 130px)",
          paddingBottom: "clamp(32px, 6vh, 60px)",
          paddingInline: "clamp(20px, 4.5vw, 64px)",
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "all" : "none",
          transform: isMenuOpen ? "translateY(0)" : "translateY(-20px)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="container"
          style={{
            margin: "auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(32px, 5vw, 70px)",
            alignItems: "center",
          }}
        >
          {/* Main Navigation Links */}
          <nav aria-label="Main Navigation">
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(10px, 1.8vh, 18px)",
              }}
            >
              {navLinks.map((item) => (
                <li key={item.number}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="nav-drawer-link"
                    style={{
                      display: "inline-flex",
                      alignItems: "baseline",
                      gap: "clamp(12px, 1.5vw, 20px)",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.75rem, 3.4vw, 3.2rem)",
                      fontWeight: 800,
                      lineHeight: 1.1,
                      letterSpacing: "var(--tracking-tight)",
                      textDecoration: "none",
                      color: "var(--color-text-light)",
                      transition: "transform 0.3s var(--ease-expo), color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--color-brand-salmon)";
                      e.currentTarget.style.transform = "translateX(14px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--color-text-light)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.75rem, 1vw, 1rem)",
                        fontWeight: 500,
                        color: "var(--color-brand-crimson)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.number}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Column: Direct Info & Social Hub */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              borderLeft: "1px solid var(--border-dark-subtle)",
              paddingLeft: "clamp(20px, 4vw, 48px)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "var(--text-micro)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-wider)",
                  color: "var(--color-text-light-muted)",
                  marginBottom: "10px",
                }}
              >
                Inquiries & Partnerships
              </p>
              <a
                href={`mailto:${agencyData.contact.email}`}
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 1.8rem)",
                  fontWeight: 700,
                  color: "var(--color-text-light)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-brand-crimson)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-light)")
                }
              >
                {agencyData.contact.email} <ArrowUpRight size={20} />
              </a>
            </div>

            <div>
              <p
                style={{
                  fontSize: "var(--text-micro)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-wider)",
                  color: "var(--color-text-light-muted)",
                  marginBottom: "10px",
                }}
              >
                Connect With Us
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                {agencyData.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge-pill dark"
                    style={{ textDecoration: "none" }}
                  >
                    {social.name} <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p
                style={{
                  fontSize: "var(--text-micro)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-wider)",
                  color: "var(--color-text-light-muted)",
                  marginBottom: "6px",
                }}
              >
                Operating Hours
              </p>
              <p
                style={{
                  fontSize: "var(--text-small)",
                  color: "var(--color-text-light-muted)",
                }}
              >
                {agencyData.contact.hours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
