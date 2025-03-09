
import React from "react";
import { motion } from "framer-motion";
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
  // Define animation variants for the pet cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
      },
    }),
  };

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
          {pets.map((pet, index) => (
            <motion.div
              key={pet.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              aria-label={`Pet card for ${pet.name}`}
            >
              <PetCard
                pet={pet}
                onViewPet={onViewPet}
                onEditPet={onEditPet}
                onDeletePet={onDeletePet}
                isDeleting={isDeleting}
                deletingPetId={deletingPetId}
                compact={false}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <PetCard
                pet={pet}
                onViewPet={onViewPet}
                onEditPet={onEditPet}
                onDeletePet={onDeletePet}
                isDeleting={isDeleting}
                deletingPetId={deletingPetId}
                compact={true}
              />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};
