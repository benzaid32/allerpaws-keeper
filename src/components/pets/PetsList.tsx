
import React from "react";
import { Pet } from "@/lib/types";
import { PetCard } from "./PetCard";
import { EmptyPetsList } from "./EmptyPetsList";

interface PetsListProps {
  pets: Pet[];
  onViewPet: (petId: string) => void;
  onEditPet: (petId: string) => void;
  onDeletePet: (petId: string) => void;
  onAddPet: () => void;
  isDeleting: boolean;
  deletingPetId: string | null;
}

export const PetsList: React.FC<PetsListProps> = ({
  pets,
  onViewPet,
  onEditPet,
  onDeletePet,
  onAddPet,
  isDeleting,
  deletingPetId,
}) => {
  if (pets.length === 0) {
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
