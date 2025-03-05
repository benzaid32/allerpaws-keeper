
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dog, Cat, Rabbit } from "lucide-react";
import { ONBOARDING_STEPS } from "@/lib/constants";
import { Pet } from "@/lib/types";

interface PetInfoStepProps {
  pet: Pet;
  updatePet: (updates: Partial<Pet>) => void;
}

const PetInfoStep: React.FC<PetInfoStepProps> = ({ pet, updatePet }) => {
  return (
    <div className="space-y-4 animate-slide-up">
      <h2 className="text-2xl font-semibold tracking-tight">{ONBOARDING_STEPS[1].title}</h2>
      <p className="text-muted-foreground">{ONBOARDING_STEPS[1].description}</p>
      
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="pet-name">Pet's Name</Label>
          <Input
            id="pet-name"
            placeholder="Enter your pet's name"
            value={pet.name}
            onChange={(e) => updatePet({ name: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Pet Type</Label>
          <RadioGroup
            value={pet.species}
            onValueChange={(value) => 
              updatePet({ species: value as "dog" | "cat" | "other" })}
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
  );
};

export default PetInfoStep;
