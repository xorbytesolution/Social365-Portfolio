import React from "react";
import { Routes, Route } from "react-router-dom";
import { useLenis } from "./hooks/useLenis";
import AuroraBackground from "./components/3d/AuroraBackground";
import CustomCursor from "./components/common/CustomCursor";
import Navbar from "./components/common/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";
import HomePage from "./pages/HomePage";
import ServicesOverviewPage from "./pages/ServicesOverviewPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import PageTransition from "./components/transitions/PageTransition";
import "./App.css";

function App() {
  // Initialize Lenis Momentum Smooth Scroll
  useLenis();

  return (
    <div className="app-wrapper">
      {/* Scroll restoration helper */}
      <ScrollToTop />

      {/* 1. Custom Interactive Cursor (Shared across all pages) */}
      <CustomCursor />

      {/* 2. Living WebGL Chromatic Aurora Shader (Shared living background) */}
      <AuroraBackground />

      <PageTransition>
        {/* 3. Floating Luxury Navbar (Shared across all pages) */}
        <Navbar />

        {/* 4. Routed Page Content */}
        <main className="site-main">
          <Routes>
            {/* Home Page: Hero, Services Deck, About Us */}
            <Route path="/" element={<HomePage />} />

            {/* All Services Overview Hub */}
            <Route path="/services" element={<ServicesOverviewPage />} />

            {/* Individual Service Deep-Dive Pages:
              - /services/social-media-management
              - /services/influencer-marketing
              - /services/digital-marketing
          */}
            <Route path="/services/:id" element={<ServiceDetailPage />} />

            {/* Fallback Catch-All */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </PageTransition>
    </div>
  );
}

export default App;
