
import React from "react";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/lib/constants";

interface OnboardingStepIndicatorProps {
  currentStep: number;
}

const OnboardingStepIndicator: React.FC<OnboardingStepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-between mb-4">
      {ONBOARDING_STEPS.map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-full h-1 rounded-full mx-0.5 transition-all duration-300",
            index <= currentStep ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
};

export default OnboardingStepIndicator;
