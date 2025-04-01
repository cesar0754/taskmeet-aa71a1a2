
import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
