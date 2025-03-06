
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pet } from "@/lib/types";
import { PawPrint } from "lucide-react";

interface PetListViewProps {
  pets: Pet[];
  onManagePets: () => void;
}

const PetListView = ({ pets, onManagePets }: PetListViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Pets</h3>
        <Button onClick={onManagePets} size="sm">
          <PawPrint className="h-4 w-4 mr-2" />
          Manage Pets
        </Button>
      </div>
      
      {pets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <div 
              key={pet.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/pet/${pet.id}`)}
            >
              <h3 className="font-semibold text-lg">{pet.name}</h3>
              <p className="text-muted-foreground capitalize">{pet.species}</p>
              {pet.knownAllergies && pet.knownAllergies.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">Allergies: </span>
                  <span className="text-sm">{pet.knownAllergies.join(", ")}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyPetState onManagePets={onManagePets} />
      )}
    </div>
  );
};

const EmptyPetState = ({ onManagePets }: { onManagePets: () => void }) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-muted/30">
      <h3 className="text-lg font-medium mb-2">No pets yet</h3>
      <p className="text-muted-foreground mb-6">
        Start by adding your first pet to AllerPaws.
      </p>
      <Button onClick={onManagePets}>Add Your Pet</Button>
    </div>
  );
};

export default PetListView;
