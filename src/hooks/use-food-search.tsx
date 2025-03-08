
import { useState } from 'react';
import { FoodProduct } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useFoodSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      console.log("Searching for:", searchTerm);
      
      // Call the search-food edge function
      const { data: response, error } = await supabase.functions.invoke('search-food', {
        body: { query: searchTerm.trim() },
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
            description: "Try a different search term or check your spelling",
          });
        } else {
          toast({
            title: "Search complete",
            description: `Found ${response.data.length} products`,
          });
        }
      } else {
        throw new Error(response.error || "Failed to search the food database");
      }
    } catch (error: any) {
      console.error("Error searching food database:", error);
      setError(error.message || "Failed to search the food database");
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

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setError(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    loading,
    error,
    handleSearch,
    clearSearch
  };
}
