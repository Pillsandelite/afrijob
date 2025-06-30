import React from 'react';
import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  return (
    <>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </>
  );
};