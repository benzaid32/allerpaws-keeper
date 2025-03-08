
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/lib/types";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const { id: petId } = useParams<{ id?: string }>();
  const { toast } = useToast();

  // Fetch pets function that can be called whenever we need fresh data
  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch pets with cache busting by adding a timestamp
      const timestamp = new Date().getTime();
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("*")
        .order("updated_at", { ascending: false })  // Order by updated_at to show latest updates first
        .order("created_at", { ascending: false });  // As a fallback

      if (petsError) {
        throw petsError;
      }

      console.log(`Fetched ${petsData?.length || 0} pets from Supabase at ${timestamp}`);

      // For each pet, fetch its allergies
      const petsWithAllergies = await Promise.all(
        (petsData || []).map(async (pet) => {
          const { data: allergiesData, error: allergiesError } = await supabase
            .from("allergies")
            .select("name")
            .eq("pet_id", pet.id);
            
          if (allergiesError) {
            console.error("Error fetching allergies:", allergiesError);
            return {
              ...pet,
              knownAllergies: [],
            } as Pet;
          }

          // Add timestamp to image URL to prevent caching
          let imageUrl = pet.image_url;
          if (imageUrl) {
            // Always use a new timestamp to force cache refresh
            const cacheBuster = `t=${timestamp}`;
            imageUrl = imageUrl.includes('?') 
              ? `${imageUrl}&${cacheBuster}` 
              : `${imageUrl}?${cacheBuster}`;
          }

          // Transform the pet data to match our Pet type
          return {
            id: pet.id,
            name: pet.name,
            species: pet.species as "dog" | "cat" | "other",
            breed: pet.breed || undefined,
            age: pet.age || undefined,
            weight: pet.weight || undefined,
            knownAllergies: allergiesData?.map((allergy) => allergy.name) || [],
            imageUrl: imageUrl || undefined,
          } as Pet;
        })
      );

      setPets(petsWithAllergies);
      
      // If a pet ID is provided in the URL, set it as the selected pet
      if (petId) {
        const selectedPet = petsWithAllergies.find(pet => pet.id === petId);
        if (selectedPet) {
          setSelectedPet(selectedPet);
        } else {
          console.error("Pet not found with ID:", petId);
          toast({
            title: "Pet Not Found",
            description: "The selected pet could not be found.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Error fetching pets:", error.message);
      toast({
        title: "Error",
        description: "Failed to load your pets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, petId]);

  // Initialize by fetching pets on component mount or when dependencies change
  useEffect(() => {
    console.log("usePets: Initial data load");
    fetchPets();
    
    // Set up an event listener to refresh data when the app comes back into focus
    // This is important to catch updates made in other tabs or after returning to the app
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('App came back into focus, refreshing pets data');
        fetchPets();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // We're no longer setting up a periodic refresh interval
    // This removes the continuous refreshing behavior
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchPets]);

  const clearSelectedPet = () => {
    setSelectedPet(null);
  };

  const deletePet = async (petId: string) => {
    try {
      // First delete allergies associated with the pet
      const { error: allergiesError } = await supabase
        .from("allergies")
        .delete()
        .eq("pet_id", petId);
      
      if (allergiesError) {
        throw allergiesError;
      }
      
      // Then delete the pet
      const { error: petError } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId);
      
      if (petError) {
        throw petError;
      }
      
      // Update local state by fetching fresh data
      await fetchPets();
      
      toast({
        title: "Success",
        description: "Pet has been deleted successfully",
      });
      
    } catch (error: any) {
      console.error("Error deleting pet:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete pet",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    pets,
    loading,
    selectedPet,
    setSelectedPet,
    clearSelectedPet,
    deletePet,
    fetchPets  // Export the function so components can trigger a refresh
  };
}
