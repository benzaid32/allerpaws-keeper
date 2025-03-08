
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { FoodProduct } from "@/lib/types";

interface DatabaseSearchTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: FoodProduct[];
  searchLoading: boolean;
  handleSearch: () => void;
  handleSelectFood: (food: FoodProduct) => void;
  onSwitchToManual: () => void;
}

const DatabaseSearchTab: React.FC<DatabaseSearchTabProps> = ({
  searchTerm,
  setSearchTerm,
  searchResults,
  searchLoading,
  handleSearch,
  handleSelectFood,
  onSwitchToManual,
}) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search food products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button onClick={() => handleSearch()} disabled={!searchTerm || searchLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {searchLoading && (
        <div className="text-center py-8">Searching...</div>
      )}
      
      {!searchLoading && searchResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Search Results</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {searchResults.map((food) => (
              <div 
                key={food.id} 
                className="border rounded-md p-3 cursor-pointer hover:bg-accent/10"
                onClick={() => handleSelectFood(food)}
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{food.name}</h4>
                    <p className="text-xs text-muted-foreground">{food.brand}</p>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFood(food);
                    }}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!searchLoading && searchTerm && searchResults.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No results found</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={onSwitchToManual}
          >
            Add manually instead
          </Button>
        </div>
      )}
    </div>
  );
};

export default DatabaseSearchTab;
