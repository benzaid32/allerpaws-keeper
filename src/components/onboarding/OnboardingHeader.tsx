
import React from "react";

const OnboardingHeader: React.FC = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-flex items-center justify-center mb-4">
        <img 
          src="/lovable-uploads/ac2e5c6c-4c6f-43e5-826f-709eba1f1a9d.png" 
          alt="AllerPaws Logo" 
          className="w-24 h-24"
        />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">AllerPaws</h1>
      <p className="text-muted-foreground mt-2">
        Managing your pet's food allergies made simple
      </p>
    </div>
  );
};

export default OnboardingHeader;
