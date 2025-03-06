import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { generateId } from "@/lib/helpers";
import { Pet } from "@/lib/types";
import { cn, storeTemporaryPetData, clearTemporaryPetData } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
import RegisterStep from "./onboarding/steps/RegisterStep";

// Extend the ONBOARDING_STEPS array to include Register step
const EXTENDED_STEPS = [...ONBOARDING_STEPS, "Register"];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn } = useAuth();
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [pet, setPet] = useState<Pet>({
    id: generateId(),
    name: "",
    species: "dog",
    knownAllergies: [],
  });
  
  // Registration form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Update pet data
  const updatePet = (updates: Partial<Pet>) => {
    setPet(prev => ({ ...prev, ...updates }));
  };

  // Clear any registration errors when switching to the register step
  useEffect(() => {
    if (step === EXTENDED_STEPS.length - 1) {
      setRegistrationError(null);
    }
  }, [step]);

  // Helper to handle rate limiting errors
  const handleRateLimitError = (error: any) => {
    console.error("Registration error:", error);
    
    if (error.status === 429) {
      setRegistrationError(
        "Too many sign-up attempts. Please wait a moment before trying again."
      );
    } else if (error.message?.includes("over_email_send_rate_limit")) {
      setRegistrationError(
        "Too many email verification requests. Please wait a moment before trying again."
      );
    } else {
      setRegistrationError(error.message || "An error occurred during registration");
    }
  };

  // Handle user registration and pet data saving
  const handleRegisterAndSavePet = async () => {
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
      
      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (authError) {
        handleRateLimitError(authError);
        return false;
      }
      
      if (!authData.user) {
        setRegistrationError("Failed to create user account");
        return false;
      }
      
      // Sign in immediately after registration to get a valid session
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        console.error("Error signing in after registration:", signInError);
        // Continue anyway since we have the user ID from registration
      }
      
      // Insert pet data into Supabase
      const { data: petData, error: petError } = await supabase.from("pets").insert({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        weight: pet.weight,
        user_id: authData.user.id,
      }).select().single();

      if (petError) {
        console.error("Error saving pet data:", petError);
        setRegistrationError("Failed to save pet information");
        return false;
      }

      console.log("Pet saved successfully:", petData);

      // Save pet allergies if any
      if (pet.knownAllergies.length > 0) {
        const allergiesData = pet.knownAllergies.map(allergen => ({
          pet_id: petData.id,
          name: allergen,
        }));

        const { error: allergiesError } = await supabase
          .from("allergies")
          .insert(allergiesData);

        if (allergiesError) {
          console.error("Error saving allergies:", allergiesError);
        }
      }

      toast({
        title: "Account created successfully",
        description: `${pet.name} has been added to your account. Please check your email to confirm your registration.`,
      });

      // Clear temporary data
      clearTemporaryPetData();
      
      // Navigate to dashboard after successful save
      navigate("/dashboard");
      
      return true;
    } catch (error: any) {
      handleRateLimitError(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle the completion of the onboarding process
  const completePetOnboarding = async () => {
    // If we're at the registration step
    if (step === EXTENDED_STEPS.length - 1) {
      return await handleRegisterAndSavePet();
    }
    
    // For users who are already logged in
    if (user) {
      try {
        setIsSubmitting(true);

        // Insert pet data into Supabase
        const { data, error } = await supabase.from("pets").insert({
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          weight: pet.weight,
          user_id: user.id,
        }).select().single();

        if (error) {
          throw error;
        }

        console.log("Pet saved successfully:", data);

        // Save pet allergies if any
        if (pet.knownAllergies.length > 0) {
          const allergiesData = pet.knownAllergies.map(allergen => ({
            pet_id: data.id,
            name: allergen,
          }));

          const { error: allergiesError } = await supabase
            .from("allergies")
            .insert(allergiesData);

          if (allergiesError) {
            console.error("Error saving allergies:", allergiesError);
          }
        }

        toast({
          title: "Pet added successfully",
          description: `${pet.name} has been added to your account.`,
        });

        // Navigate to dashboard after successful save
        navigate("/dashboard");
        return true;
      } catch (error: any) {
        toast({
          title: "Error saving pet information",
          description: error.message,
          variant: "destructive",
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Move to registration step if user is not logged in
      setStep(EXTENDED_STEPS.length - 1);
      return true;
    }
  };

  // Move to the next step with animation
  const nextStep = async () => {
    if (step < EXTENDED_STEPS.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setStep((prev) => prev + 1);
        setAnimating(false);
      }, 300);
    } else {
      // Complete onboarding
      await completePetOnboarding();
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
      case 5: // Register
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
        return <PetInfoStep pet={pet} updatePet={updatePet} />;
      case 2:
        return <AllergiesStep pet={pet} updatePet={updatePet} />;
      case 3:
        return <SymptomsStep />;
      case 4:
        return <FoodDatabaseStep />;
      case 5:
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
      <OnboardingStepIndicator currentStep={step} totalSteps={EXTENDED_STEPS.length} />

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
        totalSteps={EXTENDED_STEPS.length}
        canProceed={canProceed()} 
        onNext={nextStep}
        isLoading={isSubmitting}
      />
    </OnboardingLayout>
  );
};

export default Onboarding;
