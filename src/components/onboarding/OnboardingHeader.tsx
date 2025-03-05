
import React from "react";
import { Rabbit } from "lucide-react";

const OnboardingHeader: React.FC = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <Rabbit className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">AllerPaws</h1>
      <p className="text-muted-foreground mt-2">
        Managing your pet's food allergies made simple
      </p>
    </div>
  );
};

export default OnboardingHeader;
