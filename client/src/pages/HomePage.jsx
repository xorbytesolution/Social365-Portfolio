import React from "react";
import HeroSection from "../components/home/HeroSection";
import ServicesDeck from "../components/home/ServicesDeck";
import AboutSection from "../components/home/AboutSection";
import OurProcess from "../components/home/OurProcess";
import ContactSection from "../components/home/ContactSection";

/**
 * HomePage
 * Flagship overview containing Hero, Services Deck, and About Us.
 */
export default function HomePage() {
  return (
    <>
      {/* Component 1: Hero Section with Interactive 3D Sphere */}
      <HeroSection />

      {/* Component 2: Flagship Services Deck with Stacked Cards */}
      <ServicesDeck />

      {/* Component 3: About Us Section with 3D Sculpture */}
      <AboutSection />

      {/* Component 4: Our Process Section */}
      <OurProcess />
      
      {/* Component 5: Let's Talk Contact Section */}
      <ContactSection />
    </>
  );
}
