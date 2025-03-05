
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { generateId, setLocalStorage } from "@/lib/helpers";
import { Pet } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/lib/constants";

// Import Onboarding components
import OnboardingLayout from "./onboarding/OnboardingLayout";
import OnboardingHeader from "./onboarding/OnboardingHeader";
import OnboardingStepIndicator from "./onboarding/OnboardingStepIndicator";
import OnboardingFooter from "./onboarding/OnboardingFooter";

// Import Step components
import WelcomeStep from "./onboarding/steps/WelcomeStep";
import PetInfoStep from "./onboarding/steps/PetInfoStep";
import AllergiesStep from "./onboarding/steps/AllergiesStep";
import SymptomsStep from "./onboarding/steps/SymptomsStep";
import FoodDatabaseStep from "./onboarding/steps/FoodDatabaseStep";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [pet, setPet] = useState<Pet>({
    id: generateId(),
    name: "",
    species: "dog",
    knownAllergies: [],
  });

  // Update pet data
  const updatePet = (updates: Partial<Pet>) => {
    setPet(prev => ({ ...prev, ...updates }));
  };

  // Move to the next step with animation
  const nextStep = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setStep((prev) => prev + 1);
        setAnimating(false);
      }, 300);
    } else {
      // Complete onboarding
      setLocalStorage("pet", pet);
      setLocalStorage("onboardingComplete", true);
      navigate("/dashboard");
    }
  };

  // Validation for current step
  const canProceed = () => {
    switch (step) {
      case 0: // Welcome
        return true;
      case 1: // Pet Info
        return pet.name.trim() !== "";
      case 2: // Allergies
        return true; // Can proceed even without allergies
      case 3: // Symptoms
        return true;
      case 4: // Food Database
        return true;
      default:
        return true;
    }
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return <PetInfoStep pet={pet} updatePet={updatePet} />;
      case 2:
        return <AllergiesStep pet={pet} updatePet={updatePet} />;
      case 3:
        return <SymptomsStep />;
      case 4:
        return <FoodDatabaseStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <OnboardingLayout animating={animating}>
      {/* Logo and App Name */}
      <OnboardingHeader />
      
      {/* Onboarding Steps */}
      <OnboardingStepIndicator currentStep={step} />

      {/* Step Content */}
      <Card className={cn(
        "border border-border shadow-elegant overflow-hidden transition-all",
        animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
      )}>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <OnboardingFooter 
        currentStep={step} 
        canProceed={canProceed()} 
        onNext={nextStep}
      />
    </OnboardingLayout>
  );
};

export default Onboarding;
