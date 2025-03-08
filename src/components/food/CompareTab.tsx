
import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Search, Trash2 } from "lucide-react";
import FoodComparison from "@/components/food/FoodComparison";
import { useFoodComparison } from "@/hooks/use-food-comparison";

const CompareTab: React.FC<{ onSwitchToSearch: () => void }> = ({ onSwitchToSearch }) => {
  const { selectedFoods, removeFromComparison, clearComparison } = useFoodComparison();

  return (
    <div>
      {selectedFoods.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Comparing {selectedFoods.length} Products</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearComparison}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
          <FoodComparison foods={selectedFoods} onRemove={removeFromComparison} />
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-2">No products selected for comparison</h3>
          <p className="max-w-md mx-auto">
            Add products to compare by clicking the "Compare" button next to products in the search results.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onSwitchToSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Search Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompareTab;
