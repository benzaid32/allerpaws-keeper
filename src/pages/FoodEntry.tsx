
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/layout/MobileLayout";
import PatternBackground from "@/components/ui/pattern-background";
import { usePets } from "@/hooks/use-pets";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  
  // Get pet name
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
      
      if (itemsError) throw itemsError;
      
      // Then delete the entry
      const { error: entryError } = await supabase
        .from("food_entries")
        .delete()
        .eq("id", entry.id);
      
      if (entryError) throw entryError;
      
      toast({
        title: "Entry deleted",
        description: "Food entry has been removed from your diary",
      });
      
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
