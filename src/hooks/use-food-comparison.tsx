
import { useState, useEffect } from 'react';
import { FoodProduct } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";

export function useFoodComparison() {
  const [selectedFoods, setSelectedFoods] = useState<FoodProduct[]>([]);
  const { toast } = useToast();
  const { isPremium } = useSubscriptionContext();
  
  // Load comparison items from localStorage on initial load
  useEffect(() => {
    const savedItems = localStorage.getItem('comparisonItems');
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        setSelectedFoods(parsedItems);
      } catch (err) {
        console.error('Error parsing saved comparison items:', err);
        localStorage.removeItem('comparisonItems');
      }
    }
  }, []);

  // Save comparison items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('comparisonItems', JSON.stringify(selectedFoods));
  }, [selectedFoods]);

  const addToComparison = (product: FoodProduct) => {
    console.log("Adding to comparison:", product);
    
    if (selectedFoods.some(p => p.id === product.id)) {
      toast({
        title: "Already added",
        description: "This product is already in your comparison list",
      });
      return;
    }
    
    if (selectedFoods.length >= 3 && !isPremium) {
      toast({
        title: "Premium feature",
        description: "Upgrade to premium to compare more than 3 products",
      });
      return;
    }

    if (selectedFoods.length >= 5) {
      toast({
        title: "Maximum reached",
        description: "You can compare up to 5 products at once",
      });
      return;
    }

    setSelectedFoods(prev => [...prev, product]);
    toast({
      title: "Added to comparison",
      description: `${product.name} added to comparison`,
    });
  };

  const removeFromComparison = (productId: string) => {
    setSelectedFoods(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Removed from comparison",
      description: "Product removed from comparison",
    });
  };

  const clearComparison = () => {
    setSelectedFoods([]);
    localStorage.removeItem('comparisonItems');
    toast({
      title: "Comparison cleared",
      description: "All products removed from comparison",
    });
  };

  return {
    selectedFoods,
    addToComparison,
    removeFromComparison,
    clearComparison
  };
}
