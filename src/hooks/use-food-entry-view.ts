
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFoodEntry = (id?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pets, setPets] = useState<{ id: string; name: string }[]>([]);

  // Fetch food entry data
  useEffect(() => {
    if (!id) return;
    
    const fetchFoodEntry = async () => {
      try {
        setLoading(true);
        
        // Fetch the food entry
        const { data: entryData, error: entryError } = await supabase
          .from("food_entries")
          .select("*")
          .eq("id", id)
          .single();
        
        if (entryError) throw entryError;
        
        // Fetch related food items
        const { data: foodItems, error: itemsError } = await supabase
          .from("food_items")
          .select("*")
          .eq("entry_id", id);
        
        if (itemsError) throw itemsError;
        
        // Combine the data
        const fullEntry = {
          ...entryData,
          food_items: foodItems || []
        };
        
        setEntry(fullEntry);
        
        // Fetch pets for the pet name
        const { data: petsData } = await supabase
          .from("pets")
          .select("id, name");
        
        if (petsData) {
          setPets(petsData);
        }
      } catch (error) {
        console.error("Error fetching food entry:", error);
        toast({
          title: "Error",
          description: "Failed to load food entry",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoodEntry();
  }, [id, toast]);
  
  // Get pet name from pet ID
  const getPetName = (petId: string): string => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : "Unknown Pet";
  };
  
  // Handle entry deletion
  const handleDelete = async () => {
    if (!entry) return;
    
    try {
      // First delete related food items
      const { error: itemsError } = await supabase
        .from("food_items")
        .delete()
        .eq("entry_id", entry.id);
      
      if (itemsError) throw itemsError;
      
      // Then delete the entry itself
      const { error: entryError } = await supabase
        .from("food_entries")
        .delete()
        .eq("id", entry.id);
      
      if (entryError) throw entryError;
      
      toast({
        title: "Entry deleted",
        description: "Food entry has been deleted successfully",
      });
      
      // Navigate back to food diary
      navigate("/food-diary");
    } catch (error) {
      console.error("Error deleting food entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete food entry",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
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
