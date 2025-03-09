
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PetsList } from "@/components/pets/PetsList";
import { usePets } from "@/hooks/use-pets";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/layout/MobileLayout";
import { PetsActionBar } from "@/components/pets/PetsActionBar";

const PetsPage = () => {
  const navigate = useNavigate();
  const { pets, loading, deletePet, fetchPets, isOffline } = usePets();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");

  // Fetch pets on component mount
  useEffect(() => {
    console.log("PetsPage: Fetching pets on mount");
    fetchPets(true);
  }, [fetchPets]);

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
        description: "Pet deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting pet:", error);
      toast({
        title: "Error",
        description: "Failed to delete pet",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletingPetId(null);
    }
  };

  const handleAddPet = () => {
    navigate("/add-pet");
  };

  return (
    <MobileLayout title="Pet Management">
      <div className="space-y-4">
        <PetsActionBar
          onAddPet={handleAddPet}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          petCount={pets?.length || 0}
        />

        <PetsList
          pets={pets || []}
          onViewPet={handleViewPet}
          onEditPet={handleEditPet}
          onDeletePet={handleDeletePet}
          onAddPet={handleAddPet}
          isDeleting={isDeleting}
          deletingPetId={deletingPetId}
          isLoading={loading}
          displayMode={displayMode}
        />

        {!loading && pets && pets.length > 0 && (
          <Button
            onClick={handleAddPet}
            variant="outline"
            className="w-full mt-4 border-dashed"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another Pet
          </Button>
        )}

        {isOffline && (
          <div className="mt-4 bg-yellow-50 p-3 rounded-md text-yellow-800 text-sm">
            You're currently offline. Some features may be limited.
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default PetsPage;
