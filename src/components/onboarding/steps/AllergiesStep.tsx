
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS, COMMON_ALLERGENS } from "@/lib/constants";
import { Pet } from "@/lib/types";

interface AllergiesStepProps {
  pet: Pet;
  updatePet: (updates: Partial<Pet>) => void;
}

const AllergiesStep: React.FC<AllergiesStepProps> = ({ pet, updatePet }) => {
  const [customAllergen, setCustomAllergen] = useState("");

  // Add a custom allergen to the list
  const addCustomAllergen = () => {
    if (customAllergen.trim() !== "") {
      updatePet({
        knownAllergies: [...pet.knownAllergies, customAllergen.trim()]
      });
      setCustomAllergen("");
    }
  };

  // Toggle a common allergen
  const toggleAllergen = (allergen: string) => {
    const allergies = pet.knownAllergies.includes(allergen)
      ? pet.knownAllergies.filter((a) => a !== allergen)
      : [...pet.knownAllergies, allergen];
    
    updatePet({ knownAllergies: allergies });
  };

  // Remove an allergen from the list
  const removeAllergen = (allergen: string) => {
    updatePet({
      knownAllergies: pet.knownAllergies.filter((a) => a !== allergen)
    });
  };
  
  return (
    <div className="space-y-4 animate-slide-up">
      <h2 className="text-2xl font-semibold tracking-tight">{ONBOARDING_STEPS[2].title}</h2>
      <p className="text-muted-foreground">{ONBOARDING_STEPS[2].description}</p>
      
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
  );
};

export default AllergiesStep;
