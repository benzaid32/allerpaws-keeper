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
  displayMode?: "grid" | "list";
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
  displayMode = "grid",
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
    <>
      {displayMode === "grid" ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onViewPet={onViewPet}
              onEditPet={onEditPet}
              onDeletePet={onDeletePet}
              isDeleting={isDeleting}
              deletingPetId={deletingPetId}
              compact={false}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onViewPet={onViewPet}
              onEditPet={onEditPet}
              onDeletePet={onDeletePet}
              isDeleting={isDeleting}
              deletingPetId={deletingPetId}
              compact={true}
            />
          ))}
        </div>
      )}
    </>
  );
};
