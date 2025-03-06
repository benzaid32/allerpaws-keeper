
import React from "react";
import { cn } from "@/lib/utils";

interface OnboardingStepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const OnboardingStepIndicator: React.FC<OnboardingStepIndicatorProps> = ({ 
  currentStep, 
  totalSteps = 5 
}) => {
  return (
    <div className="flex justify-between mb-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
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
