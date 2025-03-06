
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn, clearTemporaryPetData } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Import Onboarding components
import OnboardingLayout from "./onboarding/OnboardingLayout";
import OnboardingHeader from "./onboarding/OnboardingHeader";
import OnboardingStepIndicator from "./onboarding/OnboardingStepIndicator";
import OnboardingFooter from "./onboarding/OnboardingFooter";

// Import Step components
import WelcomeStep from "./onboarding/steps/WelcomeStep";
import RegisterStep from "./onboarding/steps/RegisterStep";

// Define our steps for onboarding (just welcome and register now)
const ONBOARDING_STEPS = [
  { title: "Welcome", description: "Welcome to AllerPaws" },
  { title: "Create Account", description: "Sign up to get started" }
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  // Registration form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const nextStep = () => {
    setAnimating(true);
    setTimeout(() => {
      setStep((curr) => curr + 1);
      setAnimating(false);
    }, 300);
  };

  const prevStep = () => {
    setAnimating(true);
    setTimeout(() => {
      setStep((curr) => curr - 1);
      setAnimating(false);
    }, 300);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setRegistrationError(null);

    try {
      if (step === 1) {
        const options = {
          data: {
            full_name: fullName,
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        };
        
        const { error } = await signUp(email, password, options);

        if (error) {
          setRegistrationError(error.message);
          toast({
            title: "Registration failed",
            description: "There was an error creating your account",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a link to verify your account",
          });
          clearTemporaryPetData();
          navigate("/auth/verify-email");
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError(error.message || "An unexpected error occurred");
      toast({
        title: "Registration failed",
        description: error.message || "There was an error creating your account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) {
      return fullName.length > 0 && email.length > 0 && password.length >= 6;
    }
    return false;
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return (
          <RegisterStep
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isSubmitting={isSubmitting}
            registrationError={registrationError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout animating={animating}>
      {/* Logo and App Name */}
      <OnboardingHeader />
      
      {/* Onboarding Steps */}
      <OnboardingStepIndicator currentStep={step} totalSteps={ONBOARDING_STEPS.length} />

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
        totalSteps={ONBOARDING_STEPS.length}
        canProceed={canProceed()} 
        onNext={nextStep}
        isLoading={isSubmitting}
      />
    </OnboardingLayout>
  );
};

export default Onboarding;
