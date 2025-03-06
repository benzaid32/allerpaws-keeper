
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Plus, X, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BottomNavigation from "@/components/BottomNavigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FoodAnalyzer from "@/components/FoodAnalyzer";

interface FoodItem {
  id?: string;
  name: string;
  type: "regular" | "treat" | "supplement";
  amount: string;
  ingredients: string[];
  notes: string;
}

const FoodEntry = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [petName, setPetName] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Current food item being added
  const [currentFood, setCurrentFood] = useState<FoodItem>({
    name: "",
    type: "regular",
    amount: "",
    ingredients: [],
    notes: "",
  });
  const [currentIngredient, setCurrentIngredient] = useState("");
  
  useEffect(() => {
    if (!petId) return;
    
    const fetchPetInfo = async () => {
      try {
        const { data, error } = await supabase
          .from("pets")
          .select("name")
          .eq("id", petId)
          .single();
          
        if (error) throw error;
        
        setPetName(data.name);
      } catch (error: any) {
        console.error("Error fetching pet info:", error.message);
        toast({
          title: "Error",
          description: "Failed to load pet information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPetInfo();
  }, [petId, toast]);
  
  const addIngredient = () => {
    if (!currentIngredient.trim()) return;
    
    // Check if already exists
    if (currentFood.ingredients.includes(currentIngredient.trim())) {
      toast({
        title: "Ingredient already added",
        description: "This ingredient is already in the list",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentFood(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, currentIngredient.trim()]
    }));
    setCurrentIngredient("");
  };
  
  const removeIngredient = (ingredientToRemove: string) => {
    setCurrentFood(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i !== ingredientToRemove)
    }));
  };
  
  const handleFoodItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentFood(prev => ({ ...prev, [name]: value }));
  };
  
  const addFoodItem = () => {
    if (!currentFood.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the food item",
        variant: "destructive",
      });
      return;
    }
    
    setFoodItems(prev => [...prev, { ...currentFood }]);
    setCurrentFood({
      name: "",
      type: "regular",
      amount: "",
      ingredients: [],
      notes: "",
    });
    
    toast({
      title: "Food item added",
      description: `${currentFood.name} added to the entry`,
    });
  };
  
  const removeFoodItem = (index: number) => {
    setFoodItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!petId) return;
    
    if (foodItems.length === 0) {
      toast({
        title: "No food items",
        description: "Please add at least one food item",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create food entry
      const { data: entry, error: entryError } = await supabase
        .from("food_entries")
        .insert({
          pet_id: petId,
          date: date.toISOString(),
          notes: notes.trim() || null,
        })
        .select()
        .single();
        
      if (entryError) throw entryError;
      
      // Add food items
      const foodItemsToInsert = foodItems.map(item => ({
        entry_id: entry.id,
        name: item.name,
        type: item.type,
        amount: item.amount || null,
        ingredients: item.ingredients.length > 0 ? item.ingredients : null,
        notes: item.notes || null,
      }));
      
      const { error: itemsError } = await supabase
        .from("food_items")
        .insert(foodItemsToInsert);
        
      if (itemsError) throw itemsError;
      
      toast({
        title: "Food entry recorded",
        description: `Food entry for ${petName} has been saved`,
      });
      
      navigate(`/pet/${petId}`);
    } catch (error: any) {
      console.error("Error saving food entry:", error.message);
      toast({
        title: "Error",
        description: "Failed to save food entry",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container pt-6 pb-20">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  return (
    <div className="container pt-6 pb-20">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Food Entry for {petName}</h1>
      </div>
      
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Food Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="border rounded-lg p-4 space-y-4 mt-4">
                  <h3 className="font-medium">Add Food Item</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Food Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={currentFood.name}
                      onChange={handleFoodItemChange}
                      placeholder="Kibble, wet food, treat, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={currentFood.type}
                        onValueChange={(value: "regular" | "treat" | "supplement") => 
                          setCurrentFood(prev => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular Food</SelectItem>
                          <SelectItem value="treat">Treat</SelectItem>
                          <SelectItem value="supplement">Supplement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (Optional)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        value={currentFood.amount}
                        onChange={handleFoodItemChange}
                        placeholder="1 cup, 2 oz, etc."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Ingredients (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        placeholder="Add an ingredient"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addIngredient();
                          }
                        }}
                      />
                      <Button type="button" onClick={addIngredient} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {currentFood.ingredients.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {currentFood.ingredients.map((ingredient) => (
                          <Badge key={ingredient} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                            <span>{ingredient}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 hover:bg-muted"
                              onClick={() => removeIngredient(ingredient)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes about this food (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={currentFood.notes}
                      onChange={handleFoodItemChange}
                      placeholder="Any notes about this food item"
                    />
                  </div>
                  
                  <Button 
                    type="button" 
                    onClick={addFoodItem} 
                    className="w-full"
                    disabled={!currentFood.name.trim()}
                  >
                    Add Food Item
                  </Button>
                </div>
                
                {foodItems.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Added Food Items:</h3>
                    <div className="space-y-3">
                      {foodItems.map((item, index) => (
                        <div key={index} className="bg-muted rounded-md p-3 relative">
                          <div className="pr-8">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{item.name}</div>
                              <Badge variant="outline">{item.type}</Badge>
                            </div>
                            {item.amount && (
                              <div className="text-sm text-muted-foreground mt-1">Amount: {item.amount}</div>
                            )}
                            {item.ingredients.length > 0 && (
                              <div className="mt-2">
                                <div className="text-sm font-medium">Ingredients:</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.ingredients.map((ingredient) => (
                                    <Badge key={ingredient} variant="secondary" className="text-xs">
                                      {ingredient}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.notes && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                <div className="font-medium">Notes:</div>
                                {item.notes}
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFoodItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="entryNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="entryNotes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes about this feeding"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting || foodItems.length === 0}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Food Entry"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <FoodAnalyzer petId={petId || ""} petName={petName} />
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default FoodEntry;
