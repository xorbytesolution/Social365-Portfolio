# Social365 Portfolio — Agent & Developer Guidelines (AGENTS.md)

Welcome to the **Social365 Enterprise Portfolio Website** project. This document serves as the primary rulebook, architectural reference, and operational guide for all AI agents and engineers working on this codebase.

---

## 1. Project Overview & Business Context

- **Client / Brand:** Social365
- **Brand Positioning:** Premier Digital Growth Agency specializing in Social Media Management, Influencer Marketing, and High-Performance Digital Marketing.
- **Tone & Voice:** Bold, strategic, ultra-modern, editorial, and growth-oriented.
- **Benchmark Inspiration:** [KOTA (London)](https://kota.co.uk/) — world-class digital craft, living chromatic aurora backgrounds, 3D interactive physics, silky smooth inertia scrolling, and bold statement typography.
- **Brand Logo:** Located at `assets/logo.jpeg` with black grotesque lettering and the signature gradient `365` (navy $\rightarrow$ crimson/coral $\rightarrow$ radiant salmon).

---

## 2. Approved Technology Stack

### Frontend (`client/`)
- **Runtime & Bundler:** React 18+ powered by [Vite](https://vitejs.dev/)
- **3D Graphics & Shaders:** [Three.js](https://threejs.org/) (Custom WebGL Aurora shader + interactive 3D hero glass/refractive sphere)
- **Animation Engine:** [GSAP](https://greensock.com/gsap/) with ScrollTrigger (Card stacking, magnetic buttons, text reveals)
- **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/) (Inertia momentum scrolling)
- **Icons:** `lucide-react` (Ultra-crisp geometric line icons)
- **Styling Architecture:** Vanilla CSS with scoped design tokens, custom properties, and fluid typography (`clamp()`). No Tailwind unless explicitly mandated.

### Backend (`server/`)
- **Runtime:** Node.js (v18+) with [Express](https://expressjs.com/)
- **Database:** MongoDB with [Mongoose](https://mongoosejs.com/)
- **API Endpoints:**
  - `POST /api/inquiries` — Intake and validate project discovery requests from the "Let's Talk" form.
  - `POST /api/newsletter` — Newsletter subscription handler.
  - `GET /api/projects` — Serve case studies and showcase items.
- **Middleware:** `cors`, `dotenv`, `express.json()`, validation & error handlers.

---

## 3. Core Visual Design System & Aesthetics

### 3.1 Color Palette
- `--color-bg-light`: `#F8F9FA` (Main editorial canvas)
- `--color-bg-dark`: `#0B0C10` (Dark contrast containers, footer, navigation sheet)
- `--color-surface`: `#FFFFFF` (Floating card backgrounds)
- `--color-text-main`: `#0C0D12` (High-contrast grotesque typography)
- `--color-text-muted`: `#636779` (Secondary body & metadata)
- `--color-accent-navy`: `#1B1F3B` (Brand gradient deep start)
- `--color-accent-crimson`: `#E03A52` (Brand gradient vibrant core)
- `--color-accent-salmon`: `#F88379` (Brand gradient warm highlight)
- `--color-border-subtle`: `rgba(0, 0, 0, 0.08)`

### 3.2 Visual Signatures (KOTA Inspired)
1. **Fluid Chromatic Aurora:** Living background WebGL shader subtly shifting in response to cursor and scroll velocity.
2. **Hero 3D Lens:** 3D interactive refractive glass sphere embedded directly inside the hero statement typography.
3. **Stacked Service Deck:** Sticky pinned cards with asymmetric curved leaf corners (`border-radius: 36px 120px 36px 36px`), multi-layer 3D tilt visuals on the right, and punchy deliverables on the left.
4. **Multiplier Philosophy Pillars:** `01 — Brand Clarity` $\times$ `02 — Creative Craft` $\times$ `03 — Commercial Momentum` cards separated by mathematical `✕` operators.
5. **Mega Footer:** Massive interactive email link (`social365.work@gmail.com`), social channels with diagonal arrow links (`↗`), and certification pills.

---

## 4. Directory & File Structure

```
portfolio/
├── AGENTS.md                                   # This agent constitution file
├── Social365_Portfolio_Website_Structure.md    # Content and page structure spec
├── social365_project_brain.md                  # Architectural masterplan
├── assets/                                     # Raw brand assets and reference screenshots
│   ├── logo.jpeg
│   └── Reference_*.png
├── client/                                     # Vite + React Frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/                             # AuroraBackground.jsx, HeroSphere3D.jsx
│   │   │   ├── common/                         # Navbar.jsx, Footer.jsx, MagneticButton.jsx, CustomCursor.jsx
│   │   │   ├── home/                           # HeroSection.jsx, WorkGrid.jsx, ServicesDeck.jsx, PillarsSection.jsx
│   │   │   ├── services/                       # ServiceCards.jsx, DeliverablesList.jsx
│   │   │   └── contact/                        # InquiryForm.jsx, BudgetPicker.jsx
│   │   ├── data/                               # servicesData.js, projectsData.js, processData.js
│   │   ├── hooks/                              # useLenis.js, useMousePosition.js
│   │   ├── styles/                             # tokens.css, typography.css, layout.css, animations.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── server/                                     # Node.js + Express Backend
    ├── src/
    │   ├── config/db.js                        # Mongoose MongoDB connection
    │   ├── models/Inquiry.js                   # Lead submission schema
    │   ├── routes/inquiryRoutes.js             # API routes
    │   └── server.js                           # Express entry point
    └── package.json
```

---

## 5. Development Principles & Code Rules

1. **Aesthetics Are First-Class:** Every section must feel intentional, polished, and premium. Avoid generic templates, unstyled forms, or default browser elements.
2. **Modular Data Separation:** Incomplete or pending company data (such as team members or final process copy) must live in `src/data/*.js` files rather than being hardcoded into JSX, enabling instant client updates.
3. **Smooth Scroll & Performance:** Ensure Three.js WebGL rendering runs efficiently at 60fps with proper geometry disposal on component unmounts. Disable or optimize WebGL shaders gracefully on low-power mobile devices.
4. **Accessible Semantics:** Proper semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`, single `<h1>`), distinct contrast ratios, and descriptive `aria-label`s on icon buttons.
5. **No Regressions:** When modifying CSS or layouts, ensure existing smooth scroll and card pin interactions are preserved.

---

## 6. Development Commands

### Frontend (`client/`)
- Dev server: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`

### Backend (`server/`)
- Dev server (with nodemon): `npm run dev`
- Start server: `npm start`
