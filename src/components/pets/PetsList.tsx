
import React from "react";
import { Pet } from "@/lib/types";
import { PetCard } from "./PetCard";
import { EmptyPetsList } from "./EmptyPetsList";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface PetsListProps {
  pets: Pet[];
  onViewPet: (petId: string) => void;
  onEditPet: (petId: string) => void;
  onDeletePet: (petId: string) => void;
  onAddPet: () => void;
  isDeleting: boolean;
  deletingPetId: string | null;
  isLoading?: boolean;
}

export const PetsList: React.FC<PetsListProps> = ({
  pets,
  onViewPet,
  onEditPet,
  onDeletePet,
  onAddPet,
  isDeleting,
  deletingPetId,
  isLoading = false,
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Add debugging logs to help troubleshoot
  console.log("PetsList - Received pets:", pets);
  
  if (!pets || pets.length === 0) {
    console.log("PetsList - No pets found, showing empty state");
    return <EmptyPetsList onAddPet={onAddPet} />;
  }

  return (
    <div className="space-y-4">
      {pets.map((pet) => (
        <PetCard
          key={pet.id}
          pet={pet}
          onViewPet={onViewPet}
          onEditPet={onEditPet}
          onDeletePet={onDeletePet}
          isDeleting={isDeleting}
          deletingPetId={deletingPetId}
        />
      ))}
    </div>
  );
};
