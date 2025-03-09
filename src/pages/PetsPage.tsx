
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PetsList } from "@/components/pets/PetsList";
import { usePets } from "@/hooks/use-pets";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/layout/MobileLayout";
import { PetsActionBar } from "@/components/pets/PetsActionBar";
import { markUserChanges } from "@/lib/sync-utils";

const PetsPage = () => {
  const navigate = useNavigate();
  const { pets, loading, deletePet, fetchPets, isOffline } = usePets();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Fetch pets on component mount with improved loading state management
  useEffect(() => {
    console.log("PetsPage: Initial mount, loading pets");
    const loadPets = async () => {
      try {
        await fetchPets(true);
      } finally {
        // Mark initial load as complete, regardless of result
        setInitialLoadDone(true);
      }
    };
    
    loadPets();
  }, []);

  // Listen for storage events from other pages/tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pets_updated' || e.key === null) {
        console.log('Storage change detected for pets, refreshing data');
        fetchPets(true);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom event for same-tab updates
    const handlePetsChanged = () => {
      console.log('Pets data changed event detected, refreshing');
      fetchPets(true);
    };
    
    window.addEventListener('pets-data-changed', handlePetsChanged);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('pets-data-changed', handlePetsChanged);
    };
  }, [fetchPets]);

  const handleViewPet = (petId: string) => {
    navigate(`/pet/${petId}`);
  };

  const handleEditPet = (petId: string) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleDeletePet = async (petId: string) => {
    try {
      setDeletingPetId(petId);
      setIsDeleting(true);
      await deletePet(petId);
      
      // Mark changes for sync and dispatch event
      markUserChanges('pets');
      window.dispatchEvent(new Event('pets-data-changed'));
      
      // Update localStorage to notify other tabs
      try {
        localStorage.setItem('pets_updated', Date.now().toString());
      } catch (e) {
        console.warn('Could not update localStorage for cross-tab notification', e);
      }
      
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
  
  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple refreshes
    
    try {
      setIsRefreshing(true);
      await fetchPets(true);
      toast({
        title: "Refreshed",
        description: "Pet list has been refreshed",
      });
    } catch (error) {
      console.error("Error refreshing pets:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh pet list",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show true loading state only during initial load
  const isLoading = loading && !initialLoadDone;

  return (
    <MobileLayout title="Pet Management">
      <div className="space-y-4">
        <PetsActionBar
          onAddPet={handleAddPet}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          petCount={pets?.length || 0}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <PetsList
          pets={pets || []}
          onViewPet={handleViewPet}
          onEditPet={handleEditPet}
          onDeletePet={handleDeletePet}
          onAddPet={handleAddPet}
          isDeleting={isDeleting}
          deletingPetId={deletingPetId}
          isLoading={isLoading}
          displayMode={displayMode}
        />

        {!isLoading && pets && pets.length > 0 && (
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
