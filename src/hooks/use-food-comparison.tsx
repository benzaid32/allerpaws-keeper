
import { useState } from 'react';
import { FoodProduct } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";

export function useFoodComparison() {
  const [selectedFoods, setSelectedFoods] = useState<FoodProduct[]>([]);
  const { toast } = useToast();
  const { isPremium } = useSubscriptionContext();

  const addToComparison = (product: FoodProduct) => {
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
  };

  const clearComparison = () => {
    setSelectedFoods([]);
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
