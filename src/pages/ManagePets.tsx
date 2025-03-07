
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePets } from "@/hooks/use-pets";
import MobileLayout from "@/components/layout/MobileLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PetsActionBar } from "@/components/pets/PetsActionBar";
import { PetsList } from "@/components/pets/PetsList";
import { useToast } from "@/hooks/use-toast";

const ManagePets = () => {
  const { pets, loading, deletePet, fetchPets } = usePets();
  const navigate = useNavigate();
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Force fetch pets data when component mounts
  useEffect(() => {
    console.log("ManagePets - Component mounted, fetching pets");
    const loadData = async () => {
      try {
        await fetchPets();
      } catch (error) {
        console.error("Error fetching pets:", error);
        toast({
          title: "Error",
          description: "Failed to load your pets. Please try again.",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, [fetchPets, toast]);

  const handleRefresh = async () => {
    console.log("ManagePets - Manual refresh triggered");
    setIsRefreshing(true);
    try {
      await fetchPets();
      toast({
        title: "Success",
        description: "Pet list refreshed",
      });
    } catch (error) {
      console.error("Error refreshing pets:", error);
      toast({
        title: "Error",
        description: "Failed to refresh pets",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleAddPet = () => {
    navigate("/add-pet");
  };

  const handleEditPet = (petId: string) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleViewPet = (petId: string) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleDeletePet = async (petId: string) => {
    try {
      setDeletingPetId(petId);
      setIsDeleting(true);
      await deletePet(petId);
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

  console.log("ManagePets - Rendering with pets:", pets, "loading:", loading);

  return (
    <MobileLayout title="Your Pets">
      <div className="space-y-6">
        {/* Action Bar with Add Pet and Refresh Buttons */}
        <PetsActionBar 
          onAddPet={handleAddPet} 
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Pet List */}
        <PetsList
          pets={pets}
          onViewPet={handleViewPet}
          onEditPet={handleEditPet}
          onDeletePet={handleDeletePet}
          onAddPet={handleAddPet}
          isDeleting={isDeleting}
          deletingPetId={deletingPetId}
          isLoading={loading}
        />
      </div>
    </MobileLayout>
  );
};

export default ManagePets;
