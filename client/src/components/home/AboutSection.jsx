import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroSculpture3D from "../3d/HeroSculpture3D";
import MagneticButton from "../common/MagneticButton";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);
  const visualRef = useRef(null);
  const statsRef = useRef(null);
  const statValueRefs = useRef([]);

  const stats = [
    { value: 3, suffix: "+", label: "Years of Experience" },
    { value: 100, suffix: "+", label: "Brands Collaborated" },
    { value: 250, suffix: "+", label: "Successful Campaigns" },
  ];

  // ==========================================
  // GSAP ABOUT SECTION ANIMATIONS
  // ==========================================
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Respect users who prefer reduced motion
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const headlineLines = section.querySelectorAll(
          ".about-headline-line-inner",
        );

        const decorativeRing = section.querySelector(".about-decorative-ring");

        const description = section.querySelector(".about-description");

        const visual = visualRef.current;

        // ------------------------------------------
        // 1. CINEMATIC HEADLINE REVEAL
        // ------------------------------------------
        const introTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
        });

        introTimeline.fromTo(
          headlineLines,
          {
            yPercent: 115,
            autoAlpha: 0,
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.16,
            ease: "power4.out",
          },
        );

        // Decorative ring entrance
        if (decorativeRing) {
          introTimeline.fromTo(
            decorativeRing,
            {
              scale: 0,
              rotation: -90,
              autoAlpha: 0,
            },
            {
              scale: 1,
              rotation: 0,
              autoAlpha: 1,
              duration: 0.65,
              ease: "back.out(1.7)",
            },
            "-=0.45",
          );
        }

        // ------------------------------------------
        // 2. DESCRIPTION REVEAL
        // ------------------------------------------
        introTimeline.fromTo(
          description,
          {
            y: 35,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.35",
        );

        // ------------------------------------------
        // 3. CTA ENTRANCE
        // ------------------------------------------
        if (ctaRef.current) {
          introTimeline.fromTo(
            ctaRef.current,
            {
              y: 25,
              scale: 0.94,
              autoAlpha: 0,
            },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.45",
          );
        }

        // ------------------------------------------
        // 4. 3D SCULPTURE REVEAL
        // ------------------------------------------
        if (visual) {
          gsap.fromTo(
            visual,
            {
              y: 55,
              scale: 0.94,
              autoAlpha: 0,
            },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 1.3,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                once: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        // ------------------------------------------
        // 5. STATISTICS REVEAL + COUNT UP
        // ------------------------------------------
        if (statsRef.current) {
          ScrollTrigger.create({
            trigger: statsRef.current,
            start: "top 85%",
            once: true,

            onEnter: () => {
              const statItems =
                statsRef.current.querySelectorAll(".about-stat-item");

              // Reveal statistics one by one
              gsap.fromTo(
                statItems,
                {
                  y: 35,
                  autoAlpha: 0,
                },
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.8,
                  stagger: 0.16,
                  ease: "power3.out",
                },
              );

              // Animate numerical values
              stats.forEach((stat, index) => {
                const element = statValueRefs.current[index];
                if (!element) return;

                const counter = { value: 0 };

                element.textContent = `0${stat.suffix}`;

                gsap.to(counter, {
                  value: stat.value,
                  duration: 1.7,
                  delay: index * 0.12,
                  ease: "power2.out",

                  onUpdate: () => {
                    element.textContent = `${Math.round(counter.value)}${stat.suffix}`;
                  },
                });
              });
            },
          });
        }
      });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      // No animation for reduced-motion preference:
      // all content remains naturally visible.

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="container about-container">
        {/* ==========================================
            LEFT COLUMN: EDITORIAL CONTENT
        ========================================== */}
        <div className="about-content-column">
          {/* Eyebrow */}
          {/* <div className="about-eyebrow">
            <span className="badge-pill">
              <span className="hero-status-dot" />
              ABOUT US • 04 — 03
            </span>
          </div> */}

          {/* Animated Headline */}
          <h2 className="about-headline">
            <span className="about-headline-line">
              <span className="about-headline-line-inner">More</span>
            </span>

            <span className="about-headline-line">
              <span className="about-headline-line-inner">Than a </span>
            </span>

            <span className="about-headline-line">
              <span className="about-headline-line-inner">
                Social Agency
                <span className="about-headline-dot" aria-hidden="true">
                  .
                </span>
              </span>
            </span>
          </h2>

          {/* Description */}
          <p className="about-description">
            We help businesses build a strong digital presence through strategic
            marketing, creative storytelling, and impactful brand communication.
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="about-cta-wrapper">
            <MagneticButton
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#work")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              style={{
                backgroundColor: "var(--color-brand-crimson)",
                color: "#ffffff",
                padding: "14px 34px",
                fontSize: "var(--text-body)",
                boxShadow: "0 10px 30px rgba(216, 43, 72, 0.3)",
              }}
            >
              Explore Our Work <ArrowUpRight size={18} />
            </MagneticButton>
          </div>

          {/* Animated Statistics */}
          <div ref={statsRef} className="about-stats-row">
            {stats.map((stat, index) => (
              <div key={stat.label} className="about-stat-item">
                <span
                  ref={(el) => {
                    statValueRefs.current[index] = el;
                  }}
                  className="about-stat-value"
                >
                  {stat.value}
                  {stat.suffix}
                </span>

                <span className="about-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            RIGHT COLUMN: THREE.JS SCULPTURE
        ========================================== */}
        <div ref={visualRef} className="about-visual-column">
          <HeroSculpture3D />
        </div>
      </div>
    </section>
  );
}
