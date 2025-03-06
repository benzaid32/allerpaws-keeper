
import React from "react";
import Onboarding from "@/components/Onboarding";
import HeroSection from "./welcome/HeroSection";
import FeaturesSection from "./welcome/FeaturesSection";
import TestimonialsSection from "./welcome/TestimonialsSection";
import LandingFooter from "./welcome/LandingFooter";
import { APP_NAME } from "@/lib/constants";

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
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Background image with enhanced opacity control */}
        <div 
          className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80')] 
                    bg-no-repeat bg-right bg-contain opacity-[0.07] dark:opacity-[0.05] z-0"
          style={{ filter: 'saturate(1.2)' }}
        ></div>
        
        {/* Floating decorative blobs */}
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 animate-pulse-gentle"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/3 animate-pulse-gentle" 
             style={{ animationDelay: '2s', animationDuration: '7s' }}></div>
        <div className="absolute top-2/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse-gentle"
             style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10 flex-grow">
        <HeroSection onGetStarted={onGetStarted} />
        <FeaturesSection />
        <TestimonialsSection />
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default WelcomeScreen;
