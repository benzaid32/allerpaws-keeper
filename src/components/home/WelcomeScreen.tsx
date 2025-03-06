
import React from "react";
import Onboarding from "@/components/Onboarding";
import HeroSection from "./welcome/HeroSection";
import FeaturesSection from "./welcome/FeaturesSection";
import TestimonialsSection from "./welcome/TestimonialsSection";
import LandingFooter from "./welcome/LandingFooter";

interface WelcomeScreenProps {
  showOnboarding: boolean;
  onGetStarted: () => void;
}

const WelcomeScreen = ({ showOnboarding, onGetStarted }: WelcomeScreenProps) => {
  if (showOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-blue-950/20 overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80')] bg-no-repeat bg-right bg-contain opacity-20 dark:opacity-10 z-0"></div>
      
      {/* Hero section */}
      <div className="container mx-auto px-4 py-12 relative z-10 flex-grow">
        <HeroSection onGetStarted={onGetStarted} />
        <FeaturesSection />
        <TestimonialsSection />
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default WelcomeScreen;
