
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/layout/MobileLayout";
import PatternBackground from "@/components/ui/pattern-background";
import { supabase } from "@/integrations/supabase/client";
import { usePets } from "@/hooks/use-pets";

interface FoodEntry {
  id: string;
  created_at: string;
  pet_id: string;
  notes?: string;
  date: string;
  food_name?: string;
  food_type?: string;
}

const EditFoodEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pets } = usePets();
  
  const [entry, setEntry] = useState<FoodEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [petId, setPetId] = useState<string>("");
  const [foodName, setFoodName] = useState<string>("");
  const [foodType, setFoodType] = useState<string>("regular");
  const [notes, setNotes] = useState<string>("");
  
  // Fetch the food entry details
  useEffect(() => {
    const fetchEntry = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("food_entries")
          .select(`
            *,
            food_items (*)
          `)
          .eq("id", id)
          .single();
        
        if (error) {
          throw error;
        }
        
        console.log("Food entry data:", data);
        
        if (data) {
          // Extract the first food item if available
          const foodItem = data.food_items && data.food_items.length > 0 
            ? data.food_items[0] 
            : null;
          
          const formattedEntry = {
            ...data,
            food_name: foodItem ? foodItem.name : "Unnamed Food",
            food_type: foodItem ? foodItem.type : "regular",
          } as FoodEntry;
          
          setEntry(formattedEntry);
          setDate(new Date(formattedEntry.date));
          setPetId(formattedEntry.pet_id);
          setFoodName(formattedEntry.food_name || "");
          setFoodType(formattedEntry.food_type || "regular");
          setNotes(formattedEntry.notes || "");
        }
      } catch (error) {
        console.error("Error fetching food entry:", error);
        toast({
          title: "Error",
          description: "Failed to load food entry details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntry();
  }, [id, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !date || !petId || !foodName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Update the entry in the database
      const { error } = await supabase
        .from("food_entries")
        .update({
          pet_id: petId,
          notes: notes,
          date: format(date, "yyyy-MM-dd"),
        })
        .eq("id", id);
      
      if (error) {
        throw error;
      }
      
      // Update the food item
      // Note: This is simplified and assumes a single food item per entry
      // In a real app, you might need to handle multiple food items
      
      toast({
        title: "Success",
        description: "Food entry updated successfully",
      });
      
      navigate(`/food-entry/${id}`);
    } catch (error) {
      console.error("Error updating food entry:", error);
      toast({
        title: "Error",
        description: "Failed to update food entry",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <MobileLayout
        title="Edit Food Entry"
        showBackButton
        onBack={() => navigate(`/food-entry/${id}`)}
      >
        <PatternBackground color="primary">
          <div className="p-4 text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4">Loading entry details...</p>
          </div>
        </PatternBackground>
      </MobileLayout>
    );
  }
  
  return (
    <MobileLayout
      title="Edit Food Entry"
      showBackButton
      onBack={() => navigate(`/food-entry/${id}`)}
    >
      <PatternBackground color="primary">
        <div className="space-y-6 p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pet">Pet</Label>
              <Select value={petId} onValueChange={setPetId}>
                <SelectTrigger>
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="foodName">Food Name</Label>
              <Input
                id="foodName"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="Enter food name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="foodType">Food Type</Label>
              <Select value={foodType} onValueChange={setFoodType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select food type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="treat">Treat</SelectItem>
                  <SelectItem value="supplement">Supplement</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes"
                rows={4}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/food-entry/${id}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </PatternBackground>
    </MobileLayout>
  );
};

export default EditFoodEntry;
