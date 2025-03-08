
import { useState, useEffect } from 'react';
import { FoodProduct } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useFoodDetails(foodId: string | undefined) {
  const [food, setFood] = useState<FoodProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFoodDetails = async () => {
      if (!foodId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching food details for ID:", foodId);
        
        // Call the Supabase food_products table directly
        const { data, error } = await supabase
          .from('food_products')
          .select('*')
          .eq('id', foodId)
          .maybeSingle();

        console.log("Food details query result:", { data, error });

        if (error) {
          console.error("Error fetching food details:", error);
          throw error;
        }

        if (data) {
          console.log("Food details retrieved:", data);
          setFood(data as FoodProduct);
        } else {
          console.log("No food data found for ID:", foodId);
          // Try fetching from search results before giving up
          const cachedResults = localStorage.getItem('foodSearchResults');
          if (cachedResults) {
            const parsedResults = JSON.parse(cachedResults);
            const foundFood = parsedResults.find((item: FoodProduct) => item.id === foodId);
            if (foundFood) {
              console.log("Found food in cached search results:", foundFood);
              setFood(foundFood);
              return;
            }
          }
          throw new Error("Food product not found");
        }
      } catch (error: any) {
        console.error("Error in food details fetch:", error);
        setError(error.message || "Failed to load food details");
        toast({
          title: "Error loading food details",
          description: error.message || "Failed to load food details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodId, toast]);

  return { food, loading, error };
}
