
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { FoodProduct } from "@/lib/types";

// Interface for form data
interface FoodEntryFormData {
  pet_id: string;
  food_name: string;
  food_type: string;
  date: string;
  notes?: string;
}

export const useFoodEntry = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  const [selectedFood, setSelectedFood] = useState<FoodProduct | null>(null);
  
  const handleSelectFood = (food: FoodProduct) => {
    setSelectedFood(food);
    setActiveTab("manual"); // Switch to manual tab to show and allow editing the selected food
    toast({
      title: "Food selected",
      description: `${food.name} has been selected. You can now edit details if needed.`,
    });
  };
  
  const handleSubmit = async (data: FoodEntryFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create a unique ID for the food entry
      const entryId = uuidv4();
      
      // Get the current user's ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!userData.user) throw new Error("You must be logged in to add a food entry");
      
      const userId = userData.user.id;
      
      // Prepare the food entry data
      const entryData = {
        id: entryId,
        pet_id: data.pet_id,
        date: data.date,
        notes: data.notes || null,
      };
      
      // Insert into food_entries table
      const { error: entryError } = await supabase
        .from("food_entries")
        .insert(entryData);
      
      if (entryError) throw entryError;
      
      // Prepare the food item data
      const foodItemData = {
        id: uuidv4(),
        entry_id: entryId,
        name: data.food_name,
        type: data.food_type,
      };
      
      // Insert into food_items table
      const { error: itemError } = await supabase
        .from("food_items")
        .insert(foodItemData);
      
      if (itemError) throw itemError;
      
      toast({
        title: "Food entry added",
        description: "Your food entry has been successfully logged",
      });
      
      // Navigate back to food diary
      navigate("/food-diary");
    } catch (error) {
      console.error("Error adding food entry:", error);
      toast({
        title: "Error",
        description: "Failed to add food entry",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // New function to save a food product from search to the database
  const saveSearchResultToDatabase = async (food: FoodProduct, petId: string, notes?: string) => {
    try {
      setIsSubmitting(true);
      
      // Get the current user's ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!userData.user) throw new Error("You must be logged in to add a food entry");
      
      // Create a unique ID for the food entry
      const entryId = uuidv4();
      
      // Current date
      const today = new Date().toISOString().split('T')[0];
      
      // Insert into food_entries table
      const { error: entryError } = await supabase
        .from("food_entries")
        .insert({
          id: entryId,
          pet_id: petId,
          date: today,
          notes: notes || null,
        });
      
      if (entryError) throw entryError;
      
      // Insert into food_items table
      const { error: itemError } = await supabase
        .from("food_items")
        .insert({
          id: uuidv4(),
          entry_id: entryId,
          name: food.name,
          type: food.type.toLowerCase(),
          ingredients: food.ingredients || null,
        });
      
      if (itemError) throw itemError;
      
      toast({
        title: "Food saved to diary",
        description: `${food.name} has been added to your food diary`,
      });
      
      // Navigate back to food diary
      navigate("/food-diary");
    } catch (error) {
      console.error("Error saving food product:", error);
      toast({
        title: "Error",
        description: "Failed to save food product to diary",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    activeTab,
    setActiveTab,
    selectedFood,
    setSelectedFood,
    handleSelectFood,
    handleSubmit,
    saveSearchResultToDatabase
  };
};
