import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
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

function InfluencerNetworkVisual() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let nodes = [];
    let animationFrame;
    let visible = true;

    const mouse = pointerRef.current;
    const connectionDistance = 125;
    const nodeCount = 65;

    const createNodes = () => {
      nodes = Array.from({ length: nodeCount }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1.2,
        accent: i % 7 === 0,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createNodes();
      draw();
    };

    const draw = () => {
      if (!width || !height) return;

      ctx.clearRect(0, 0, width, height);

      nodes.forEach((node) => {
        if (!reducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        const dx = mouse.x === null ? Infinity : mouse.x - node.x;
        const dy = mouse.y === null ? Infinity : mouse.y - node.y;
        const mouseDistance = Math.hypot(dx, dy);

        // Gently attract nearby particles towards the pointer.
        if (!reducedMotion && mouseDistance < 160) {
          const influence = (1 - mouseDistance / 160) * 0.018;
          node.vx += dx * influence * 0.01;
          node.vy += dy * influence * 0.01;
        }

        // Keep movement controlled.
        node.vx = Math.max(-0.65, Math.min(0.65, node.vx));
        node.vy = Math.max(-0.65, Math.min(0.65, node.vy));
      });

      // Draw connections between nearby nodes.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const distance = Math.hypot(a.x - b.x, a.y - b.y);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            ctx.strokeStyle = `rgba(190, 90, 125, ${opacity * 0.3})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes.
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        ctx.fillStyle = node.accent ? "#ed2445" : "rgba(105, 91, 115, 0.65)";

        ctx.fill();

        if (node.accent) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(237, 36, 69, 0.25)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    };

    const animate = () => {
      if (!visible) return;

      draw();

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;

        if (visible && !reducedMotion) {
          cancelAnimationFrame(animationFrame);
          animationFrame = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationFrame);
        }
      },
      { threshold: 0.05 },
    );

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);
    observer.observe(canvas);

    resize();

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: null, y: null };
  };

  return (
    <div
      className="influencer-network-visual"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas
        ref={canvasRef}
        className="influencer-network-canvas"
        aria-label="Interactive creator connection network"
        role="img"
      />

      <div className="dot-field-top">
        <span className="dot-field-status">
          <span />
          CREATOR NETWORK ACTIVE
        </span>

        <span className="dot-field-system">NETWORK // 365</span>
      </div>

      <div className="dot-field-center">
        <span className="dot-field-center-label">INFLUENCE IN MOTION</span>

        <h4>
          People.
          <br />
          Create impact<span>.</span>
        </h4>
      </div>

      <div className="dot-field-bottom">
        <span>CREATORS · BRANDS · AUDIENCES</span>
        <span className="dot-field-live">● CONNECTED</span>
      </div>
    </div>
  );
}

function DotFieldVisual() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let animationFrame;
    let startTime = performance.now();
    let isVisible = true;

    const spacing = 22;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      draw(performance.now());
    };

    const draw = (time) => {
      if (!width || !height) return;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      const pointerX = pointerRef.current.x ?? centerX;
      const pointerY = pointerRef.current.y ?? centerY;

      const elapsed = reducedMotion ? 0 : time - startTime;

      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const centerDistance = Math.hypot(x - centerX, y - centerY);

          const pointerDistance = Math.hypot(x - pointerX, y - pointerY);

          const baseWave = Math.sin(centerDistance * 0.035 - elapsed * 0.0015);

          const pointerWave = Math.sin(
            pointerDistance * 0.065 - elapsed * 0.006,
          );

          const pointerInfluence = Math.exp(-pointerDistance / 150);

          const displacement =
            baseWave * 2.5 + pointerWave * pointerInfluence * 9;

          const radius =
            1.15 + Math.max(0, baseWave) * 0.45 + pointerInfluence * 0.65;

          const drawX = x + displacement;
          const drawY = y + displacement * 0.45;

          const accent = pointerInfluence > 0.35;

          ctx.beginPath();
          ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);

          ctx.fillStyle = accent
            ? `rgba(237, 36, 69, ${0.45 + pointerInfluence * 0.5})`
            : `rgba(105, 91, 115, ${0.28 + Math.max(0, baseWave) * 0.3})`;

          ctx.fill();
        }
      }
    };

    const animate = (time) => {
      if (!isVisible) return;

      draw(time);

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible && !reducedMotion) {
          cancelAnimationFrame(animationFrame);
          animationFrame = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationFrame);
        }
      },
      { threshold: 0.05 },
    );

    const resizeObserver = new ResizeObserver(resizeCanvas);

    resizeObserver.observe(canvas);
    observer.observe(canvas);

    resizeCanvas();

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: null, y: null };
  };

  return (
    <div
      className="dot-field-visual"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas
        ref={canvasRef}
        className="dot-field-canvas"
        aria-label="Animated interactive particle field"
        role="img"
      />

      <div className="dot-field-top">
        <span className="dot-field-status">
          <span />
          AUDIENCE IN MOTION
        </span>

        <span className="dot-field-system">SOCIAL // 365</span>
      </div>

      <div className="dot-field-center">
        <span className="dot-field-center-label">SOCIAL CONNECTIONS</span>
        <h4>
          Every dot.
          <br />A connection<span>.</span>
        </h4>
      </div>

      <div className="dot-field-bottom">
        <span>STRATEGY · CONTENT · COMMUNITY</span>
        <span className="dot-field-live">● LIVE FIELD</span>
      </div>
    </div>
  );
}

function PerformanceWavesVisual() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let animationFrame;
    let isVisible = true;
    let startTime = performance.now();

    const waveColors = [
      "rgba(237, 36, 69, 0.75)",
      "rgba(255, 105, 135, 0.65)",
      "rgba(191, 145, 235, 0.55)",
      "rgba(237, 36, 69, 0.35)",
      "rgba(255, 170, 190, 0.7)",
      "rgba(160, 130, 220, 0.4)",
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    const draw = (time) => {
      if (!width || !height) return;

      ctx.clearRect(0, 0, width, height);

      const elapsed = reducedMotion ? 0 : (time - startTime) * 0.00045;
      const centerY = height * 0.52;
      const amplitude = Math.min(height * 0.2, 95);

      // Soft central glow
      const glow = ctx.createRadialGradient(
        width * 0.52,
        centerY,
        5,
        width * 0.52,
        centerY,
        width * 0.55,
      );

      glow.addColorStop(0, "rgba(255, 105, 145, 0.12)");
      glow.addColorStop(0.55, "rgba(218, 165, 240, 0.07)");
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const pointerX = pointerRef.current.x;
      const pointerY = pointerRef.current.y;

      // Draw flowing performance waves
      waveColors.forEach((color, waveIndex) => {
        const phase = waveIndex * 0.85;
        const waveAmplitude = amplitude * (0.55 + waveIndex * 0.075);

        ctx.beginPath();

        for (let x = 0; x <= width; x += 3) {
          const progress = x / width;

          const wave =
            Math.sin(progress * Math.PI * 2.2 + elapsed + phase) *
              waveAmplitude +
            Math.sin(progress * Math.PI * 4.1 - elapsed * 0.8 + phase) *
              (waveAmplitude * 0.24);

          const pointerDistance =
            pointerX === null ? 0 : Math.abs(x - pointerX);

          const pointerInfluence =
            pointerX === null ? 0 : Math.max(0, 1 - pointerDistance / 220);

          const pointerLift =
            pointerY === null
              ? 0
              : (centerY - pointerY) * pointerInfluence * 0.12;

          const y = centerY + wave + pointerLift + (waveIndex - 2.5) * 10;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = waveIndex === 0 ? 2 : 1.25;
        ctx.globalAlpha = 0.9;
        ctx.shadowColor = color;
        ctx.shadowBlur = waveIndex === 0 ? 12 : 5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // Floating performance signals
      for (let i = 0; i < 9; i++) {
        const progress = (i / 9 + elapsed * 0.12) % 1;
        const x = progress * width;

        const y =
          centerY +
          Math.sin(progress * Math.PI * 4 + elapsed * 2) * amplitude * 0.7;

        const pulse = 2.5 + Math.sin(elapsed * 4 + i) * 0.8;

        ctx.beginPath();
        ctx.arc(x, y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? "#ed2445" : "#d9a3c8";
        ctx.shadowColor = "#ed2445";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const animate = (time) => {
      if (!isVisible) return;

      draw(time);

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible && !reducedMotion) {
          cancelAnimationFrame(animationFrame);
          animationFrame = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationFrame);
        }
      },
      { threshold: 0.05 },
    );

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);
    observer.observe(canvas);
    resize();

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: null, y: null };
  };

  return (
    <div
      className="performance-waves-visual"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas
        ref={canvasRef}
        className="performance-waves-canvas"
        aria-label="Animated performance data waves"
        role="img"
      />

      <div className="performance-waves-top">
        <span className="performance-waves-status">
          <span />
          PERFORMANCE IN MOTION
        </span>

        <span className="performance-waves-system">GROWTH // 365</span>
      </div>

      <div className="performance-waves-center">
        <span>DATA · STRATEGY · RESULTS</span>
        <h4>
          Turn Data
          <br />
          Into Growth<span>.</span>
        </h4>
      </div>

      <div className="performance-waves-bottom">
        <span>REACH · CONVERSION · SCALE</span>
        <span className="performance-waves-live">
          <i /> LIVE PERFORMANCE
        </span>
      </div>
    </div>
  );
}
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
                  <div
                    className={`stack-card-inner ${
                      index === 2
                        ? "stack-card-inner--performance"
                        : "stack-card-inner--interactive"
                    }`}
                  >
                    {/* ---------------- Left Column: Details & Narrative ---------------- */}
                    <div className="service-card-copy">
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
                    {index === 0 ? (
                      <DotFieldVisual />
                    ) : index === 1 ? (
                      <InfluencerNetworkVisual />
                    ) : index === 2 ? (
                      <PerformanceWavesVisual />
                    ) : (
                      <ServiceMockupCanvas service={service} index={index} />
                    )}
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
