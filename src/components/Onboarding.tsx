
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ONBOARDING_STEPS, COMMON_ALLERGENS } from "@/lib/constants";
import { generateId, setLocalStorage } from "@/lib/helpers";
import { Pet } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Rabbit, Dog, Cat, X } from "lucide-react";

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
  const [selectedAllergen, setSelectedAllergen] = useState("");
  const [customAllergen, setCustomAllergen] = useState("");

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
      setLocalStorage("pet", pet);
      setLocalStorage("onboardingComplete", true);
      navigate("/dashboard");
    }
  };

  // Add a custom allergen to the list
  const addCustomAllergen = () => {
    if (customAllergen.trim() !== "") {
      setPet((prev) => ({
        ...prev,
        knownAllergies: [...prev.knownAllergies, customAllergen.trim()],
      }));
      setCustomAllergen("");
    }
  };

  // Add a common allergen to the list
  const toggleAllergen = (allergen: string) => {
    setPet((prev) => {
      const allergies = prev.knownAllergies.includes(allergen)
        ? prev.knownAllergies.filter((a) => a !== allergen)
        : [...prev.knownAllergies, allergen];
      
      return {
        ...prev,
        knownAllergies: allergies,
      };
    });
  };

  // Remove an allergen from the list
  const removeAllergen = (allergen: string) => {
    setPet((prev) => ({
      ...prev,
      knownAllergies: prev.knownAllergies.filter((a) => a !== allergen),
    }));
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Logo and App Name */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Rabbit className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AllerPaws</h1>
          <p className="text-muted-foreground mt-2">
            Managing your pet's food allergies made simple
          </p>
        </div>
        
        {/* Onboarding Steps */}
        <div className="flex justify-between mb-4">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-full h-1 rounded-full mx-0.5 transition-all duration-300",
                index <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step Content */}
        <Card className={cn(
          "border border-border shadow-elegant overflow-hidden transition-all",
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
        )}>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Step 0: Welcome */}
              {step === 0 && (
                <div className="space-y-4 animate-slide-up">
                  <h2 className="text-2xl font-semibold tracking-tight">{ONBOARDING_STEPS[step].title}</h2>
                  <p className="text-muted-foreground">{ONBOARDING_STEPS[step].description}</p>
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
              )}

              {/* Step 1: Pet Info */}
              {step === 1 && (
                <div className="space-y-4 animate-slide-up">
                  <h2 className="text-2xl font-semibold tracking-tight">{ONBOARDING_STEPS[step].title}</h2>
                  <p className="text-muted-foreground">{ONBOARDING_STEPS[step].description}</p>
                  
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="pet-name">Pet's Name</Label>
                      <Input
                        id="pet-name"
                        placeholder="Enter your pet's name"
                        value={pet.name}
                        onChange={(e) => setPet({ ...pet, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Pet Type</Label>
                      <RadioGroup
                        value={pet.species}
                        onValueChange={(value) => 
                          setPet({ ...pet, species: value as "dog" | "cat" | "other" })}
                        className="flex space-x-2"
                      >
                        <div className="flex flex-1 items-center space-x-2">
                          <RadioGroupItem value="dog" id="dog" className="peer sr-only" />
                          <Label
                            htmlFor="dog"
                            className="flex flex-1 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <Dog className="mb-2 h-6 w-6" />
                            <span>Dog</span>
                          </Label>
                        </div>
                        
                        <div className="flex flex-1 items-center space-x-2">
                          <RadioGroupItem value="cat" id="cat" className="peer sr-only" />
                          <Label
                            htmlFor="cat"
                            className="flex flex-1 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <Cat className="mb-2 h-6 w-6" />
                            <span>Cat</span>
                          </Label>
                        </div>
                        
                        <div className="flex flex-1 items-center space-x-2">
                          <RadioGroupItem value="other" id="other" className="peer sr-only" />
                          <Label
                            htmlFor="other"
                            className="flex flex-1 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <Rabbit className="mb-2 h-6 w-6" />
                            <span>Other</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Allergies */}
              {step === 2 && (
                <div className="space-y-4 animate-slide-up">
                  <h2 className="text-2xl font-semibold tracking-tight">{ONBOARDING_STEPS[step].title}</h2>
                  <p className="text-muted-foreground">{ONBOARDING_STEPS[step].description}</p>
                  
                  <div className="space-y-4 pt-2">
                    {/* Known Allergies */}
                    {pet.knownAllergies.length > 0 && (
                      <div className="space-y-2">
                        <Label>Known Allergies</Label>
                        <div className="flex flex-wrap gap-2">
                          {pet.knownAllergies.map((allergen) => (
                            <Badge key={allergen} variant="outline" className="flex items-center gap-1 py-1.5">
                              {allergen}
                              <button
                                onClick={() => removeAllergen(allergen)}
                                className="ml-1 rounded-full hover:bg-muted p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Common Allergens */}
                    <div className="space-y-2">
                      <Label>Common Allergens</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {COMMON_ALLERGENS.slice(0, 8).map((allergen) => (
                          <div
                            key={allergen}
                            onClick={() => toggleAllergen(allergen)}
                            className={cn(
                              "p-2 rounded-md border cursor-pointer transition-medium",
                              "flex items-center justify-between",
                              pet.knownAllergies.includes(allergen)
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <span>{allergen}</span>
                            <Checkbox
                              checked={pet.knownAllergies.includes(allergen)}
                              onCheckedChange={() => toggleAllergen(allergen)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Custom Allergen */}
                    <div className="space-y-2">
                      <Label htmlFor="custom-allergen">Add Custom Allergen</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="custom-allergen"
                          placeholder="E.g., Duck, Venison"
                          value={customAllergen}
                          onChange={(e) => setCustomAllergen(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomAllergen();
                            }
                          }}
                        />
                        <Button
                          onClick={addCustomAllergen}
                          variant="outline"
                          type="button"
                          disabled={customAllergen.trim() === ""}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Symptoms */}
              {step === 3 && (
                <div className="space-y-4 animate-slide-up">
                  <h2 className="text-2xl font-semibold tracking-tight">{ONBOARDING_STEPS[step].title}</h2>
                  <p className="text-muted-foreground">{ONBOARDING_STEPS[step].description}</p>
                  
                  <div className="space-y-4 py-2">
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                      <h3 className="font-medium">With AllerPaws, you can:</h3>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>Record symptoms daily with our simple tracker</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>Track intensity, frequency, and patterns</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>Upload photos to document visual symptoms</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>Receive reminders to log consistently</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Food Database */}
              {step === 4 && (
                <div className="space-y-4 animate-slide-up">
                  <h2 className="text-2xl font-semibold tracking-tight">{ONBOARDING_STEPS[step].title}</h2>
                  <p className="text-muted-foreground">{ONBOARDING_STEPS[step].description}</p>
                  
                  <div className="space-y-4 py-2">
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                      <h3 className="font-medium">Food Database Features:</h3>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>Search and filter pet foods by ingredients</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>Identify safe foods without your pet's allergens</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>Compare alternatives for novel protein diets</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>Receive recommendations based on your pet's needs</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="group"
          >
            {step === ONBOARDING_STEPS.length - 1 ? "Get Started" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
