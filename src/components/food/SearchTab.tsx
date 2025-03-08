
import React, { useState, useEffect } from "react";
import { useFoodSearch } from "@/hooks/use-food-search";
import { useFoodComparison } from "@/hooks/use-food-comparison";
import { FoodProduct } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, BarChart3, Info, XCircle, AlertCircle, BookPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePets } from "@/hooks/use-pets";
import { useFoodEntry } from "@/hooks/use-food-entry";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const SearchTab: React.FC = () => {
  const navigate = useNavigate();
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResults, 
    loading, 
    error,
    handleSearch, 
    clearSearch 
  } = useFoodSearch();
  const { addToComparison } = useFoodComparison();
  const [hasSearched, setHasSearched] = useState(false);
  const { pets } = usePets();
  const { saveSearchResultToDatabase, isSubmitting } = useFoodEntry();
  
  // Dialog state for adding to food diary
  const [diaryDialogOpen, setDiaryDialogOpen] = useState(false);
  const [selectedFoodForDiary, setSelectedFoodForDiary] = useState<FoodProduct | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [notes, setNotes] = useState("");

  const onSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setHasSearched(true);
    handleSearch(e);
  };

  // Clear the "hasSearched" flag when search term changes
  useEffect(() => {
    setHasSearched(false);
  }, [searchTerm]);

  // Handle saving food to diary
  const handleSaveToFoodDiary = async () => {
    if (selectedFoodForDiary && selectedPetId && saveSearchResultToDatabase) {
      await saveSearchResultToDatabase(selectedFoodForDiary, selectedPetId, notes);
      setDiaryDialogOpen(false);
      setSelectedFoodForDiary(null);
      setNotes("");
      setSelectedPetId("");
    }
  };

  // Open the "Add to Food Diary" dialog
  const openDiaryDialog = (food: FoodProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFoodForDiary(food);
    setDiaryDialogOpen(true);
  };

  return (
    <div>
      {/* Search form */}
      <div className="mb-6">
        <form onSubmit={onSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search for pet food</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="search"
                  placeholder="Search by brand or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      clearSearch();
                      setHasSearched(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button type="submit" disabled={loading || !searchTerm.trim()}>
                {loading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Example searches: "Royal Canin", "Purina", "Salmon", "Dry Food"
          </div>
        </form>
      </div>

      {/* Results */}
      <div>
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner />
            <p className="mt-2 text-muted-foreground">Searching for pet food products...</p>
          </div>
        )}
        
        {error && !loading && (
          <div className="bg-destructive/10 p-4 rounded-md flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-destructive">Search Error</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}
        
        {!loading && hasSearched && searchResults.length === 0 && !error && (
          <div className="text-center py-8 border rounded-md bg-muted/20">
            <Info className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No results found</h3>
            <p className="text-muted-foreground">
              Try a different search term or check your spelling.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Example searches: "Royal Canin", "Purina", "Salmon", "Dry Food"
            </p>
          </div>
        )}

        {searchResults.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Search Results ({searchResults.length})</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {searchResults.map((product) => (
                <SearchResultCard 
                  key={product.id} 
                  product={product} 
                  onViewDetails={() => navigate(`/food/${product.id}`)}
                  onAddToComparison={() => addToComparison(product)}
                  onAddToFoodDiary={(e) => openDiaryDialog(product, e)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Add to Food Diary Dialog */}
      <Dialog open={diaryDialogOpen} onOpenChange={setDiaryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Food Diary</DialogTitle>
            <DialogDescription>
              Save this food product to your pet's food diary
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
            
            {selectedFoodForDiary && (
              <div className="border rounded-md p-3 bg-muted/20">
                <h4 className="font-medium">{selectedFoodForDiary.name}</h4>
                <p className="text-xs text-muted-foreground">{selectedFoodForDiary.brand}</p>
              </div>
            )}
            
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
            <Button variant="outline" onClick={() => setDiaryDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveToFoodDiary}
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

interface SearchResultCardProps {
  product: FoodProduct;
  onViewDetails: () => void;
  onAddToComparison: () => void;
  onAddToFoodDiary: (e: React.MouseEvent) => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ 
  product, 
  onViewDetails, 
  onAddToComparison,
  onAddToFoodDiary
}) => {
  return (
    <Card key={product.id} className="overflow-hidden">
      <div className="flex">
        {product.imageUrl && (
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4 flex-1">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          {product.allergens && product.allergens.length > 0 && (
            <div className="mt-2">
              <span className="text-xs font-medium text-red-500">
                Common Allergens:
              </span>
              <span className="text-xs ml-1">
                {product.allergens.join(", ")}
              </span>
            </div>
          )}
          <div className="flex mt-2 space-x-2">
            <Button
              variant="link"
              className="p-0 h-auto text-xs"
              onClick={onViewDetails}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={onAddToComparison}
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Compare
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={onAddToFoodDiary}
            >
              <BookPlus className="h-3 w-3 mr-1" />
              Add to Diary
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SearchTab;
