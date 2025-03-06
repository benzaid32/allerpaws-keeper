
import React from "react";

const OnboardingHeader: React.FC = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-flex items-center justify-center mb-4">
        <img 
          src="/lovable-uploads/99366c55-0fea-4b0d-8084-4d3b93e79046.png" 
          alt="AllerPaws Logo" 
          className="w-28 h-28 drop-shadow-lg"
        />
      </div>
      <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">AllerPaws</h1>
      <p className="text-muted-foreground mt-2">
        Managing your pet's food allergies made simple
      </p>
    </div>
  );
};

export default OnboardingHeader;
