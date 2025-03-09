
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pet } from "@/lib/types";
import { PawPrint, Grid, List, PlusCircle, Camera } from "lucide-react";
import { PetsList } from "@/components/pets/PetsList";
import AddPetCard from "./AddPetCard";
import { EmptyPetsList } from "@/components/pets/EmptyPetsList";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePets } from "@/hooks/use-pets";
import { useToast } from "@/hooks/use-toast";

interface PetsSectionProps {
  pets: Pet[];
}

const PetsSection: React.FC<PetsSectionProps> = ({ pets }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { deletePet } = usePets();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  
  // Add handlers for pet actions
  const handleViewPet = (petId: string) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleEditPet = (petId: string) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleDeletePet = async (petId: string) => {
    try {
      setDeletingPetId(petId);
      setIsDeleting(true);
      await deletePet(petId);
      toast({
        title: "Success",
        description: "Pet has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting pet:", error);
      toast({
        title: "Error",
        description: "Failed to delete pet",
        variant: "destructive",
      });
    } finally {
      setDeletingPetId(null);
      setIsDeleting(false);
    }
  };

  const handleAddPet = () => {
    navigate('/add-pet');
  };

  // Show quick add button directly in header when no pets exist
  const showQuickAddButton = pets.length === 0;

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Card className="bg-white/80 border shadow-sm hover:shadow-md transition-all p-4 mb-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <PawPrint className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">Your Pets</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {pets && pets.length > 0 && (
              <ToggleGroup type="single" value={viewMode} onValueChange={(val) => val && setViewMode(val as "grid" | "list")}>
                <ToggleGroupItem value="grid" size="sm" aria-label="Grid view">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" size="sm" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            )}
            
            {showQuickAddButton ? (
              <Button 
                onClick={handleAddPet}
                size="sm" 
                className="bg-primary text-white flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Pet
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/pets')} 
                className="text-primary hover:bg-primary/10"
              >
                Manage
              </Button>
            )}
          </div>
        </div>

        {pets && pets.length > 0 ? (
          <motion.div 
            className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <PetsList 
              pets={pets}
              onViewPet={handleViewPet}
              onEditPet={handleEditPet}
              onDeletePet={handleDeletePet}
              onAddPet={handleAddPet}
              isDeleting={isDeleting}
              deletingPetId={deletingPetId}
              displayMode={viewMode}
            />
            
            {viewMode === "grid" && pets.length < 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <AddPetCard />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <EmptyPetsList onAddPet={handleAddPet} />
        )}
        
        {viewMode === "list" && pets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3"
          >
            <Button 
              onClick={handleAddPet}
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 py-3 border-dashed"
            >
              <PlusCircle className="h-4 w-4" />
              Add Another Pet
            </Button>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
};

export default PetsSection;
