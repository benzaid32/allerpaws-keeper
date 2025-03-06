
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pet } from "@/lib/types";

interface PetDetailsViewProps {
  pet: Pet;
  onBack: () => void;
}

const PetDetailsView = ({ pet, onBack }: PetDetailsViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pet Details: {pet.name}</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
        >
          Back to All Pets
        </Button>
      </div>
      
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold text-lg">{pet.name}</h3>
        <p className="text-muted-foreground capitalize">{pet.species}</p>
        
        {pet.breed && (
          <p className="mt-2">
            <span className="text-sm text-muted-foreground">Breed: </span>
            <span className="text-sm">{pet.breed}</span>
          </p>
        )}
        
        {pet.age && (
          <p className="mt-2">
            <span className="text-sm text-muted-foreground">Age: </span>
            <span className="text-sm">{pet.age} years</span>
          </p>
        )}
        
        {pet.weight && (
          <p className="mt-2">
            <span className="text-sm text-muted-foreground">Weight: </span>
            <span className="text-sm">{pet.weight} kg</span>
          </p>
        )}
        
        {pet.knownAllergies && pet.knownAllergies.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium">Known Allergies:</h4>
            <ul className="list-disc list-inside mt-2">
              {pet.knownAllergies.map((allergy, index) => (
                <li key={index} className="text-sm">{allergy}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6 flex gap-3">
          <Button 
            onClick={() => navigate(`/edit-pet/${pet.id}`)}
            variant="outline"
            size="sm"
          >
            Edit Details
          </Button>
          <Button 
            onClick={() => navigate(`/symptom-diary?petId=${pet.id}`)}
            variant="outline"
            size="sm"
          >
            Symptom Diary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsView;
