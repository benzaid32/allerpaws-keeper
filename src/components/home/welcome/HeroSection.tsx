
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-16 animate-fade-in">
        <div className="flex justify-center items-center mb-8">
          <div className="rounded-full bg-gradient-to-r from-primary/20 to-accent/20 p-4 shadow-elegant relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-pulse-gentle"></div>
            <img 
              src="/lovable-uploads/ac2e5c6c-4c6f-43e5-826f-709eba1f1a9d.png" 
              alt="AllerPaws Logo" 
              className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg relative z-10"
            />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm mb-4 leading-tight">
          {APP_NAME}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light max-w-2xl mx-auto leading-relaxed">
          {APP_DESCRIPTION}
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg px-4">
          The all-in-one solution for pet owners to identify, track, and manage food allergies in their beloved companions.
          Our powerful tools help you create elimination diets, log symptoms, and find safe food options.
        </p>
      </div>
      
      <div className="space-y-5 bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-elegant border border-border/50 animate-slide-up max-w-md mx-auto mb-16 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <Button 
          onClick={onGetStarted} 
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 text-lg group"
          size="lg"
        >
          <span>Sign Up Free</span>
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button 
          onClick={() => navigate("/auth")} 
          variant="outline" 
          className="w-full border-primary/20 hover:border-primary/50 transition-all"
          size="lg"
        >
          Sign In
        </Button>
        
        <div className="pt-2 flex justify-center items-center text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
          <span>No credit card required</span>
        </div>
        
        <Button
          onClick={() => navigate("/pricing")}
          variant="ghost"
          className="w-full hover:bg-primary/5 flex items-center justify-center gap-2"
          size="lg"
        >
          <span>View Pricing</span>
          <Sparkles className="h-4 w-4 text-amber-500" />
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
