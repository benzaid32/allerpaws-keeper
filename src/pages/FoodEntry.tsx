
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Pencil, Trash2, Zap, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/layout/MobileLayout";
import PatternBackground from "@/components/ui/pattern-background";
import { usePets } from "@/hooks/use-pets";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FoodEntryDetails {
  id: string;
  date: string;
  pet_id: string;
  notes?: string;
  food_items: {
    id: string;
    name: string;
    type: string;
    ingredients?: string[];
    notes?: string;
  }[];
}

const FoodEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pets } = usePets();
  const [entry, setEntry] = useState<FoodEntryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodAnalysis, setFoodAnalysis] = useState<any>(null);
  
  // Fetch entry details
  useEffect(() => {
    const fetchEntryDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Query the food entry and its related food items
        const { data, error } = await supabase
          .from("food_entries")
          .select(`
            *,
            food_items (*)
          `)
          .eq("id", id)
          .single();
        
        if (error) {
          console.error("Error fetching entry details:", error);
          throw error;
        }
        
        console.log("Entry details:", data);
        setEntry(data as FoodEntryDetails);
      } catch (error) {
        console.error("Error in fetch operation:", error);
        toast({
          title: "Error",
          description: "Failed to load food entry details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntryDetails();
  }, [id, toast]);
  
  // Get pet name - don't throw an error if pet is not found
  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet?.name || "Unknown Pet";
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!entry) return;
    
    try {
      // Delete food items first (due to foreign key constraints)
      const { error: itemsError } = await supabase
        .from("food_items")
        .delete()
        .eq("entry_id", entry.id);
      
      if (itemsError) {
        console.error("Error deleting food items:", itemsError);
        throw itemsError;
      }
      
      // Then delete the entry
      const { error: entryError } = await supabase
        .from("food_entries")
        .delete()
        .eq("id", entry.id);
      
      if (entryError) {
        console.error("Error deleting entry:", entryError);
        throw entryError;
      }
      
      toast({
        title: "Entry deleted",
        description: "Food entry has been removed from your diary",
      });
      
      // Navigate back to food diary
      navigate("/food-diary");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete food entry",
        variant: "destructive",
      });
    }
  };

  // Analyze food with AI
  const analyzeFood = async () => {
    if (!entry || !entry.food_items || entry.food_items.length === 0) return;
    
    // Get the ingredients from the first food item
    const ingredients = entry.food_items[0].ingredients || [];
    
    // If no ingredients are available, show a message
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "This food entry doesn't have any ingredients to analyze",
        variant: "warning",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Call the Supabase Edge Function to analyze the food
      const { data, error } = await supabase.functions.invoke("analyze-food", {
        body: { 
          ingredients,
          petAllergies: [] // We could fetch pet allergies here if needed
        }
      });
      
      if (error) {
        console.error("Error analyzing food:", error);
        throw error;
      }
      
      console.log("Food analysis result:", data);
      setFoodAnalysis(data.analysis);
      
      toast({
        title: "Analysis complete",
        description: "Food has been analyzed successfully",
      });
    } catch (error) {
      console.error("Error in food analysis:", error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze food ingredients",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center text-muted-foreground mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(entry.date)}</span>
            </div>
            <h2 className="text-lg font-semibold mb-1">
              {entry.food_items[0]?.name || "Unnamed Food"}
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {getPetName(entry.pet_id)}
              </Badge>
              {entry.food_items[0]?.type && (
                <Badge variant="secondary">
                  {entry.food_items[0].type}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Food details */}
          <div className="border rounded-lg p-4 bg-card">
            <h3 className="font-medium mb-3">Food Details</h3>
            
            {entry.food_items.map((item) => (
              <div key={item.id} className="mb-4 last:mb-0">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Type: {item.type}
                </p>
                
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Ingredients:</h5>
                    <p className="text-sm text-muted-foreground">
                      {item.ingredients.join(", ")}
                    </p>
                  </div>
                )}
                
                {item.notes && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Food Notes:</h5>
                    <p className="text-sm text-muted-foreground">
                      {item.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Entry notes */}
          {entry.notes && (
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="font-medium mb-2">Entry Notes</h3>
              <p className="text-sm text-muted-foreground">
                {entry.notes}
              </p>
            </div>
          )}
          
          {/* AI Analysis button */}
          {entry.food_items[0]?.ingredients && entry.food_items[0].ingredients.length > 0 && (
            <Button 
              className="w-full" 
              variant="outline"
              onClick={analyzeFood}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  Analyzing Food...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          )}
          
          {/* AI Analysis Results */}
          {foodAnalysis && (
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  AI Food Analysis
                </CardTitle>
                <CardDescription>
                  Nutritional profile and concerns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Summary</h4>
                  <p className="text-sm text-muted-foreground">{foodAnalysis.summary}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-sm font-medium">Quality Score</h4>
                    <div className={`text-sm font-medium ${
                      foodAnalysis.overall_quality_score >= 7 ? 'text-green-500' : 
                      foodAnalysis.overall_quality_score >= 4 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {foodAnalysis.overall_quality_score}/10
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Safety Score</h4>
                    <div className={`text-sm font-medium ${
                      foodAnalysis.safety_score >= 7 ? 'text-green-500' : 
                      foodAnalysis.safety_score >= 4 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {foodAnalysis.safety_score}/10
                    </div>
                  </div>
                </div>
                
                {foodAnalysis.nutritional_benefits && foodAnalysis.nutritional_benefits.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Benefits</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {foodAnalysis.nutritional_benefits.slice(0, 3).map((benefit: string, i: number) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {foodAnalysis.problematic_ingredients && foodAnalysis.problematic_ingredients.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Concerns</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {foodAnalysis.problematic_ingredients.slice(0, 3).map((item: any, i: number) => (
                        <li key={i}>
                          <span className="font-medium">{item.name}</span>: {item.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/edit-food-entry/${entry.id}`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </PatternBackground>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Food Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this food entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
};

export default FoodEntry;
