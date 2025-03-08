
import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Search, Trash2 } from "lucide-react";
import FoodComparison from "@/components/food/FoodComparison";
import { useFoodComparison } from "@/hooks/use-food-comparison";
import { motion } from "framer-motion";

const CompareTab: React.FC<{ onSwitchToSearch: () => void }> = ({ onSwitchToSearch }) => {
  const { selectedFoods, removeFromComparison, clearComparison } = useFoodComparison();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {selectedFoods.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Comparing {selectedFoods.length} Products</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearComparison}
              className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
          <FoodComparison foods={selectedFoods} onRemove={removeFromComparison} />
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto p-6 rounded-lg border border-dashed border-gray-200"
          >
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-2">No products selected for comparison</h3>
            <p className="max-w-md mx-auto mb-6 text-sm">
              Add products to compare by clicking the "Compare" button next to products in the search results.
            </p>
            <Button 
              variant="outline" 
              className="mt-4 font-medium"
              onClick={onSwitchToSearch}
            >
              <Search className="h-4 w-4 mr-2" />
              Search Products
            </Button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CompareTab;
