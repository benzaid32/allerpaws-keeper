
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePets } from "@/hooks/use-pets";

interface FoodItem {
  id: string;
  name: string;
  type: string;
  ingredients?: string[];
  notes?: string;
}

interface FoodEntryDetails {
  id: string;
  date: string;
  pet_id: string;
  notes?: string;
  food_items: FoodItem[];
}

export const useFoodEntry = (entryId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pets } = usePets();
  const [entry, setEntry] = useState<FoodEntryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch entry details
  useEffect(() => {
    const fetchEntryDetails = async () => {
      if (!entryId) return;
      
      try {
        setLoading(true);
        
        // Query the food entry and its related food items
        const { data, error } = await supabase
          .from("food_entries")
          .select(`
            *,
            food_items (*)
          `)
          .eq("id", entryId)
          .single();
        
        if (error) {
          console.error("Error fetching entry details:", error);
          throw error;
        }
        
        console.log("Entry details:", data);
        setEntry(data as FoodEntryDetails);
      } catch (error) {
        console.error("Error in fetch operation:", error);
        toast({
          title: "Error",
          description: "Failed to load food entry details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntryDetails();
  }, [entryId, toast]);

  // Get pet name - don't throw an error if pet is not found
  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet?.name || "Unknown Pet";
  };

  // Handle delete
  const handleDelete = async () => {
    if (!entry) return;
    
    try {
      // Delete food items first (due to foreign key constraints)
      const { error: itemsError } = await supabase
        .from("food_items")
        .delete()
        .eq("entry_id", entry.id);
      
      if (itemsError) {
        console.error("Error deleting food items:", itemsError);
        throw itemsError;
      }
      
      // Then delete the entry
      const { error: entryError } = await supabase
        .from("food_entries")
        .delete()
        .eq("id", entry.id);
      
      if (entryError) {
        console.error("Error deleting entry:", entryError);
        throw entryError;
      }
      
      toast({
        title: "Entry deleted",
        description: "Food entry has been removed from your diary",
      });
      
      // Navigate back to food diary
      navigate("/food-diary");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete food entry",
        variant: "destructive",
      });
    }
  };

  return {
    entry,
    loading,
    getPetName,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDelete
  };
};
