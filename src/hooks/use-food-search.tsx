
import { useState } from 'react';
import { FoodProduct } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useFoodSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      console.log("Searching for:", searchTerm);
      
      // Call the search-food edge function
      const { data: response, error } = await supabase.functions.invoke('search-food', {
        body: { query: searchTerm },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      console.log("Search response:", response);
      
      if (response.success && response.data) {
        setSearchResults(response.data as FoodProduct[]);
        
        if (response.data.length === 0) {
          toast({
            title: "No results found",
            description: "Try a different search term or browse our categories",
          });
        }
      } else {
        throw new Error(response.error || "Failed to search the food database");
      }
    } catch (error: any) {
      console.error("Error searching food database:", error);
      toast({
        title: "Search failed",
        description: error.message || "Failed to search the food database",
        variant: "destructive",
      });
      // Set empty results to avoid showing stale data
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    loading,
    handleSearch
  };
}
