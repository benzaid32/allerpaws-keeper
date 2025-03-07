
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePets } from "@/hooks/use-pets";
import MobileLayout from "@/components/layout/MobileLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PetsActionBar } from "@/components/pets/PetsActionBar";
import { PetsList } from "@/components/pets/PetsList";

const ManagePets = () => {
  const { pets, loading, deletePet, fetchPets } = usePets();
  const navigate = useNavigate();
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force fetch pets data when component mounts
  useEffect(() => {
    const loadData = async () => {
      await fetchPets();
    };
    loadData();
  }, [fetchPets]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPets();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
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
    } finally {
      setDeletingPetId(null);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Your Pets">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </MobileLayout>
    );
  }

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
        />
      </div>
    </MobileLayout>
  );
};

export default ManagePets;
