
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
        delay: custom * 0.05, // Reduced delay for faster appearance
      },
    }),
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading your pets...</p>
      </div>
    );
  }
  
  // Show empty state when no pets are available
  if (!pets || pets.length === 0) {
    return <EmptyPetsList onAddPet={onAddPet} />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {displayMode === "grid" ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.id}
              custom={index}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
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
    </motion.div>
  );
};
