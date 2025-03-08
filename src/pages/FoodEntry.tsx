
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/layout/MobileLayout";
import PatternBackground from "@/components/ui/pattern-background";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useFoodEntry } from "@/hooks/use-food-entry";
import { useFoodAnalysis } from "@/hooks/use-food-analysis";
import FoodEntryHeader from "@/components/food-entry/FoodEntryHeader";
import FoodItemDetails from "@/components/food-entry/FoodItemDetails";
import EntryNotes from "@/components/food-entry/EntryNotes";
import FoodAnalysisButton from "@/components/food-entry/FoodAnalysisButton";
import FoodAnalysisResults from "@/components/food-entry/FoodAnalysisResults";
import FoodEntryActions from "@/components/food-entry/FoodEntryActions";
import DeleteConfirmationDialog from "@/components/food-entry/DeleteConfirmationDialog";

const FoodEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Custom hooks
  const { 
    entry, 
    loading, 
    getPetName, 
    deleteDialogOpen, 
    setDeleteDialogOpen, 
    handleDelete 
  } = useFoodEntry(id);
  
  const {
    analyzeFood,
    isAnalyzing,
    foodAnalysis
  } = useFoodAnalysis();

  // Handler for analyze button
  const handleAnalyzeFood = () => {
    if (!entry || !entry.food_items || entry.food_items.length === 0) return;
    
    // Get the ingredients from the first food item
    const ingredients = entry.food_items[0].ingredients || [];
    analyzeFood(ingredients);
  };
  
  // Render loading state
  if (loading) {
    return (
      <MobileLayout
        title="Food Entry"
        showBackButton
        onBack={() => navigate("/food-diary")}
      >
        <PatternBackground color="primary">
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner />
            <p className="mt-4 text-muted-foreground">Loading food details...</p>
          </div>
        </PatternBackground>
      </MobileLayout>
    );
  }
  
  // Render error state if no entry found
  if (!entry) {
    return (
      <MobileLayout
        title="Food Entry"
        showBackButton
        onBack={() => navigate("/food-diary")}
      >
        <PatternBackground color="primary">
          <div className="text-center py-8 border rounded-lg bg-muted/30 px-4">
            <h3 className="font-medium mb-2">Entry Not Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The food entry you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/food-diary")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Food Diary
            </Button>
          </div>
        </PatternBackground>
      </MobileLayout>
    );
  }
  
  return (
    <MobileLayout
      title="Food Entry"
      showBackButton
      onBack={() => navigate("/food-diary")}
    >
      <PatternBackground color="primary">
        <div className="space-y-6">
          {/* Header with date and pet info */}
          <FoodEntryHeader
            date={entry.date}
            foodName={entry.food_items[0]?.name || ""}
            petName={getPetName(entry.pet_id)}
            foodType={entry.food_items[0]?.type}
          />
          
          {/* Food details */}
          <FoodItemDetails foodItems={entry.food_items} />
          
          {/* Entry notes */}
          <EntryNotes notes={entry.notes} />
          
          {/* AI Analysis button */}
          <FoodAnalysisButton
            hasIngredients={!!(entry.food_items[0]?.ingredients && entry.food_items[0].ingredients.length > 0)}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyzeFood}
          />
          
          {/* AI Analysis Results */}
          <FoodAnalysisResults analysis={foodAnalysis} />
          
          {/* Actions */}
          <FoodEntryActions
            entryId={entry.id}
            onEdit={() => navigate(`/edit-food-entry/${entry.id}`)}
            onDelete={() => setDeleteDialogOpen(true)}
          />
        </div>
      </PatternBackground>
      
      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={handleDelete}
      />
    </MobileLayout>
  );
};

export default FoodEntry;
