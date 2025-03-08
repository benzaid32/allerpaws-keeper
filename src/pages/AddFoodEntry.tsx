
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MobileLayout from "@/components/layout/MobileLayout";
import PatternBackground from "@/components/ui/pattern-background";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePets } from "@/hooks/use-pets";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { useFoodSearch } from "@/hooks/use-food-search";
import { FoodProduct } from "@/lib/types";

// Interface for form data
interface FoodEntryFormData {
  pet_id: string;
  food_name: string;
  food_type: string;
  date: string;
  notes?: string;
}

const AddFoodEntry = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pets } = usePets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  const [selectedFood, setSelectedFood] = useState<FoodProduct | null>(null);
  const { searchTerm, setSearchTerm, searchResults, loading: searchLoading, handleSearch } = useFoodSearch();
  
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FoodEntryFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Default to today's date
      food_type: "regular"
    }
  });
  
  // For select components that don't work directly with react-hook-form
  const watchPetId = watch("pet_id");
  const watchFoodType = watch("food_type");
  
  // Effect to update form when a food is selected from database
  useEffect(() => {
    if (selectedFood) {
      setValue("food_name", selectedFood.name);
      setValue("food_type", selectedFood.type.toLowerCase() || "regular");
    }
  }, [selectedFood, setValue]);
  
  const onSubmit = async (data: FoodEntryFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create a unique ID for the food entry
      const entryId = uuidv4();
      
      // Prepare the food entry data
      const entryData = {
        id: entryId,
        pet_id: data.pet_id,
        date: data.date,
        notes: data.notes || null,
      };
      
      // Insert into food_entries table
      const { error: entryError } = await supabase
        .from("food_entries")
        .insert(entryData);
      
      if (entryError) throw entryError;
      
      // Prepare the food item data
      const foodItemData = {
        id: uuidv4(),
        entry_id: entryId,
        name: data.food_name,
        type: data.food_type,
        // We're not adding a food_product_id column since it doesn't exist
        // If we get food from the database, we just store its relevant data
      };
      
      // Insert into food_items table
      const { error: itemError } = await supabase
        .from("food_items")
        .insert(foodItemData);
      
      if (itemError) throw itemError;
      
      toast({
        title: "Food entry added",
        description: "Your food entry has been successfully logged",
      });
      
      // Navigate back to food diary
      navigate("/food-diary");
    } catch (error) {
      console.error("Error adding food entry:", error);
      toast({
        title: "Error",
        description: "Failed to add food entry",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handler for selecting a food from the database
  const handleSelectFood = (food: FoodProduct) => {
    setSelectedFood(food);
    setActiveTab("manual"); // Switch to manual tab to show and allow editing the selected food
    toast({
      title: "Food selected",
      description: `${food.name} has been selected. You can now edit details if needed.`,
    });
  };
  
  return (
    <MobileLayout
      title="Add Food Entry"
      showBackButton
      onBack={() => navigate("/food-diary")}
    >
      <PatternBackground color="primary">
        <div className="space-y-6 pb-10">
          <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="database">From Database</TabsTrigger>
            </TabsList>
            
            <TabsContent value="database" className="space-y-4 mt-4">
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
                    onClick={() => setActiveTab("manual")}
                  >
                    Add manually instead
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="manual">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                {/* Pet Selection */}
                <div className="space-y-2">
                  <Label htmlFor="pet_id">Pet</Label>
                  <Select
                    value={watchPetId}
                    onValueChange={(value) => setValue("pet_id", value)}
                  >
                    <SelectTrigger id="pet_id" className="w-full">
                      <SelectValue placeholder="Select a pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pet_id && (
                    <p className="text-destructive text-sm">{errors.pet_id.message}</p>
                  )}
                </div>
                
                {/* Food Name */}
                <div className="space-y-2">
                  <Label htmlFor="food_name">Food Name</Label>
                  <Input
                    id="food_name"
                    {...register("food_name", {
                      required: "Food name is required",
                    })}
                  />
                  {errors.food_name && (
                    <p className="text-destructive text-sm">{errors.food_name.message}</p>
                  )}
                </div>
                
                {/* Food Type */}
                <div className="space-y-2">
                  <Label htmlFor="food_type">Food Type</Label>
                  <Select
                    value={watchFoodType}
                    onValueChange={(value) => setValue("food_type", value)}
                  >
                    <SelectTrigger id="food_type" className="w-full">
                      <SelectValue placeholder="Select food type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular Meal</SelectItem>
                      <SelectItem value="treat">Treat</SelectItem>
                      <SelectItem value="supplement">Supplement</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="special">Special Diet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date", {
                      required: "Date is required",
                    })}
                  />
                  {errors.date && (
                    <p className="text-destructive text-sm">{errors.date.message}</p>
                  )}
                </div>
                
                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Any observations or details about this food"
                    rows={3}
                  />
                </div>
                
                {/* Selected Food Info (if from database) */}
                {selectedFood && (
                  <div className="border rounded-md p-3 bg-muted/20">
                    <h4 className="font-medium text-sm">Selected from database:</h4>
                    <p className="text-sm">{selectedFood.name} ({selectedFood.brand})</p>
                    {selectedFood.ingredients && selectedFood.ingredients.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Contains: {selectedFood.ingredients.slice(0, 3).join(", ")}
                        {selectedFood.ingredients.length > 3 && "..."}
                      </p>
                    )}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2" 
                      onClick={() => setSelectedFood(null)}
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Food Entry"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </PatternBackground>
    </MobileLayout>
  );
};

export default AddFoodEntry;
