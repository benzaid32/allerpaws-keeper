
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/lib/types";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { id: petId } = useParams<{ id?: string }>();
  const { toast } = useToast();

  // Update online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Trigger a refresh when coming back online
      fetchPets();
      toast({
        title: "You're back online",
        description: "Syncing your latest data",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "You're offline",
        description: "Some features may be limited",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Listen for sync complete events from service worker
  useEffect(() => {
    const handleSyncComplete = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.tag === 'sync-pets') {
        console.log('Pet data sync completed, refreshing data');
        fetchPets();
      }
    };

    window.addEventListener('data-sync-complete', handleSyncComplete);

    return () => {
      window.removeEventListener('data-sync-complete', handleSyncComplete);
    };
  }, []);

  // Fetch pets function that can be called whenever we need fresh data
  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      
      // If offline, show a message but still try to fetch from cache
      if (isOffline) {
        console.log('Attempting to fetch pets data while offline (from cache)');
      }
      
      // Generate a unique cache-busting timestamp
      const timestamp = new Date().getTime();
      
      // Prepare fetch options to bypass cache in PWA context
      const fetchOptions: any = {};
      
      // For PWA in standalone mode, add cache control headers
      if (window.matchMedia('(display-mode: standalone)').matches) {
        fetchOptions.headers = {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        };
      }

      // Fetch pets with cache busting
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("*")
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false });

      if (petsError) {
        throw petsError;
      }

      console.log(`Fetched ${petsData?.length || 0} pets from Supabase at ${timestamp}`);

      // For each pet, fetch its allergies
      const petsWithAllergies = await Promise.all(
        (petsData || []).map(async (pet) => {
          // Prepare allergy fetch options with cache busting
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

          // Add timestamp to image URL to prevent caching in PWA context
          let imageUrl = pet.image_url;
          if (imageUrl && window.matchMedia('(display-mode: standalone)').matches) {
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

      // If we're in a PWA, register for background sync
      if ('serviceWorker' in navigator && 'SyncManager' in window && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('sync-pets').catch(err => {
            console.error('Failed to register background sync for pets:', err);
          });
        });
      }
    } catch (error: any) {
      console.error("Error fetching pets:", error.message);
      
      // Show different message based on online status
      if (isOffline) {
        toast({
          title: "You're offline",
          description: "Using locally stored pet data",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load your pets",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast, petId, isOffline]);

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
    fetchPets,  // Export the function so components can trigger a refresh
    isOffline   // Make offline status available to components
  };
}
