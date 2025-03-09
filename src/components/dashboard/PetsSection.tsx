import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pet } from "@/lib/types";
import { PawPrint, Grid, List, PlusCircle } from "lucide-react";
import { PetsList } from "@/components/pets/PetsList";
import AddPetCard from "./AddPetCard";
import { EmptyPetsList } from "@/components/pets/EmptyPetsList";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PetsSectionProps {
  pets: Pet[];
}

const PetsSection: React.FC<PetsSectionProps> = ({ pets }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
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

  // Show quick add button directly in header when no pets exist
  const showQuickAddButton = pets.length === 0;

  return (
    <Card className="bg-white/80 border shadow-sm hover:shadow-md transition-all p-4 mb-6">
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
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
            {viewMode === "grid" ? (
              <>
                <PetsList 
                  pets={pets}
                  onViewPet={handleViewPet}
                  onEditPet={handleEditPet}
                  onDeletePet={handleDeletePet}
                  onAddPet={handleAddPet}
                  isDeleting={false}
                  deletingPetId={null}
                  displayMode={viewMode}
                />
                {pets.length < 3 && <AddPetCard />}
              </>
            ) : (
              <>
                <PetsList 
                  pets={pets}
                  onViewPet={handleViewPet}
                  onEditPet={handleEditPet}
                  onDeletePet={handleDeletePet}
                  onAddPet={handleAddPet}
                  isDeleting={false}
                  deletingPetId={null}
                  displayMode={viewMode}
                />
                <Button 
                  onClick={handleAddPet}
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 py-3 border-dashed"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Another Pet
                </Button>
              </>
            )}
          </div>
        ) : (
          <EmptyPetsList onAddPet={handleAddPet} />
        )}
      </motion.div>
    </Card>
  );
};

export default PetsSection;
