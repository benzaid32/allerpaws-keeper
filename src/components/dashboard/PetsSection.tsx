
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pet } from "@/lib/types";
import { PawPrint } from "lucide-react";
import { PetsList } from "@/components/pets/PetsList"; // Import from the correct location
import AddPetCard from "./AddPetCard";
import { EmptyPetsList } from "@/components/pets/EmptyPetsList";

interface PetsSectionProps {
  pets: Pet[];
}

const PetsSection: React.FC<PetsSectionProps> = ({ pets }) => {
  const navigate = useNavigate();

  // Add handlers for pet actions
  const handleViewPet = (petId: string) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleEditPet = (petId: string) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleDeletePet = (petId: string) => {
    console.log("Delete pet not implemented in dashboard view");
  };

  const handleAddPet = () => {
    navigate('/add-pet');
  };

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <PawPrint className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium">Your Pets</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/pets')} 
          className="text-primary hover:bg-primary/10"
        >
          Manage
        </Button>
      </div>

      {pets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Use the PetsList component with required props */}
          <PetsList 
            pets={pets}
            onViewPet={handleViewPet}
            onEditPet={handleEditPet}
            onDeletePet={handleDeletePet}
            onAddPet={handleAddPet}
            isDeleting={false}
            deletingPetId={null}
          />
          <AddPetCard />
        </div>
      ) : (
        <EmptyPetsList onAddPet={handleAddPet} />
      )}
    </motion.div>
  );
};

export default PetsSection;
