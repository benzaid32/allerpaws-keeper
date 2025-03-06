
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn, clearTemporaryPetData } from "@/lib/utils";
// Import other constants, but not ONBOARDING_STEPS since we define it locally
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUp } = useAuth();
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  
  // Registration form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Check if the user is logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Clear any registration errors when switching to the register step
  React.useEffect(() => {
    if (step === 1) {
      setRegistrationError(null);
    }
  }, [step]);

  // Handle user registration
  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsSubmitting(true);
      setRegistrationError(null);
      
      // Clean up any existing temporary pet data
      clearTemporaryPetData();
      
      // Register the user
      const { error, needsEmailConfirmation } = await signUp(email, password, {
        full_name: fullName,
      });
      
      if (error) {
        setRegistrationError(error.message || "Failed to create user account");
        return false;
      }
      
      // If email confirmation is needed, navigate to auth page with a flag
      if (needsEmailConfirmation) {
        navigate("/auth?verifyEmail=true");
        return true;
      }
      
      // Navigate to dashboard or auth page as appropriate
      navigate(user ? "/dashboard" : "/auth");
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError(error.message || "An error occurred during registration");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete onboarding - just register the user
  const completeOnboarding = async () => {
    return await handleRegister();
  };

  // Move to the next step with animation
  const nextStep = async () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setStep((prev) => prev + 1);
        setAnimating(false);
      }, 300);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  // Validation for current step
  const canProceed = () => {
    switch (step) {
      case 0: // Welcome
        return true;
      case 1: // Register
        return (
          email.trim() !== "" && 
          password.trim() !== "" && 
          fullName.trim() !== "" &&
          password.length >= 6
        );
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
        return <WelcomeStep />;
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
