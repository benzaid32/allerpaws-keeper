
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Search, Plus, Save } from "lucide-react";
import { FoodProduct } from "@/lib/types";
import { usePets } from "@/hooks/use-pets";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DatabaseSearchTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: FoodProduct[];
  searchLoading: boolean;
  handleSearch: () => void;
  handleSelectFood: (food: FoodProduct) => void;
  onSwitchToManual: () => void;
  isSubmitting?: boolean;
  saveSearchResultToDatabase?: (food: FoodProduct, petId: string, notes?: string) => Promise<void>;
}

const DatabaseSearchTab: React.FC<DatabaseSearchTabProps> = ({
  searchTerm,
  setSearchTerm,
  searchResults,
  searchLoading,
  handleSearch,
  handleSelectFood,
  onSwitchToManual,
  isSubmitting,
  saveSearchResultToDatabase,
}) => {
  const { pets } = usePets();
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedFoodForSave, setSelectedFoodForSave] = useState<FoodProduct | null>(null);
  const [notes, setNotes] = useState("");

  const handleSaveFood = async () => {
    if (selectedFoodForSave && selectedPetId && saveSearchResultToDatabase) {
      await saveSearchResultToDatabase(selectedFoodForSave, selectedPetId, notes);
      setSaveDialogOpen(false);
      setSelectedFoodForSave(null);
      setNotes("");
    }
  };

  const openSaveDialog = (food: FoodProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFoodForSave(food);
    setSaveDialogOpen(true);
  };

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
                  <div className="flex gap-2">
                    {saveSearchResultToDatabase && (
                      <Button variant="ghost" size="sm" onClick={(e) => openSaveDialog(food, e)}>
                        <Save className="h-4 w-4" />
                      </Button>
                    )}
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

      {/* Save to Diary Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to Food Diary</DialogTitle>
            <DialogDescription>
              Save this food directly to your pet's food diary.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pet-select">Select Pet</Label>
              <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                <SelectTrigger id="pet-select">
                  <SelectValue placeholder="Select a pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any notes about this food"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveFood}
              disabled={!selectedPetId || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save to Diary"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabaseSearchTab;
