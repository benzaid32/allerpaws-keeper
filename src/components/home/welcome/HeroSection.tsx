
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-16 animate-fade-in">
        <div className="flex justify-center items-center mb-6">
          <div className="rounded-full p-3 bg-gradient-to-br from-primary to-accent shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"></path>
              <path d="M14.5 5.173c0-1.39 1.577-2.493 3.5-2.173 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"></path>
              <path d="M8 14v.5"></path>
              <path d="M16 14v.5"></path>
              <path d="M11.25 16.25h1.5L12 17l-.75-.75z"></path>
              <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"></path>
            </svg>
          </div>
        </div>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm mb-4">{APP_NAME}</h1>
        <p className="text-xl text-muted-foreground mb-6">{APP_DESCRIPTION}</p>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The all-in-one solution for pet owners to identify, track, and manage food allergies in their beloved companions.
          Our powerful tools help you create elimination diets, log symptoms, and find safe food options.
        </p>
      </div>
      
      <div className="space-y-4 bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border/50 animate-slide-up max-w-md mx-auto mb-16">
        <Button 
          onClick={onGetStarted} 
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 text-lg"
          size="lg"
        >
          Sign Up Free
        </Button>
        <Button 
          onClick={() => navigate("/auth")} 
          variant="outline" 
          className="w-full"
          size="lg"
        >
          Sign In
        </Button>
        <Button
          onClick={() => navigate("/pricing")}
          variant="ghost"
          className="w-full"
          size="lg"
        >
          View Pricing
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
