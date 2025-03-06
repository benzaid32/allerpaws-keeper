
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface OnboardingFooterProps {
  currentStep: number;
  totalSteps?: number;
  canProceed: boolean;
  onNext: () => void;
  isLoading?: boolean;
}

const OnboardingFooter: React.FC<OnboardingFooterProps> = ({ 
  currentStep, 
  totalSteps = 5,
  canProceed, 
  onNext,
  isLoading = false
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  
  return (
    <div className="flex justify-end pt-2">
      <Button
        onClick={onNext}
        disabled={!canProceed || isLoading}
        className="group"
      >
        {isLoading ? (
          <>
            <span className="mr-2">Saving...</span>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
          </>
        ) : (
          <>
            {isLastStep ? "Create Account" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </div>
  );
};

export default OnboardingFooter;
