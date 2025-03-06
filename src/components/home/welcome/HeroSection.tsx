
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
          <img 
            src="/lovable-uploads/99366c55-0fea-4b0d-8084-4d3b93e79046.png" 
            alt="AllerPaws Logo" 
            className="w-32 h-32 drop-shadow-md"
          />
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
