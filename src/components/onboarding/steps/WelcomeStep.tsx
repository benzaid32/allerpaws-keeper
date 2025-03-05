
import React from "react";
import { Rabbit } from "lucide-react";
import { ONBOARDING_STEPS } from "@/lib/constants";

const WelcomeStep: React.FC = () => {
  return (
    <div className="space-y-4 animate-slide-up">
      <h2 className="text-2xl font-semibold tracking-tight">{ONBOARDING_STEPS[0].title}</h2>
      <p className="text-muted-foreground">{ONBOARDING_STEPS[0].description}</p>
      <div className="py-4 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-gentle"></div>
          <div className="absolute inset-4 bg-primary/20 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Rabbit className="w-20 h-20 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;
