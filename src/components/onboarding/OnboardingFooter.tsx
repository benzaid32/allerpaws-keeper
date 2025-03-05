
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ONBOARDING_STEPS } from "@/lib/constants";

interface OnboardingFooterProps {
  currentStep: number;
  canProceed: boolean;
  onNext: () => void;
}

const OnboardingFooter: React.FC<OnboardingFooterProps> = ({ 
  currentStep, 
  canProceed, 
  onNext 
}) => {
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  
  return (
    <div className="flex justify-end pt-2">
      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="group"
      >
        {isLastStep ? "Get Started" : "Continue"}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

export default OnboardingFooter;
