
import React, { useState } from "react";
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
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FoodEntryFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Default to today's date
      food_type: "regular"
    }
  });
  
  // For select components that don't work directly with react-hook-form
  const watchPetId = watch("pet_id");
  const watchFoodType = watch("food_type");
  
  const onSubmit = async (data: FoodEntryFormData) => {
    try {
      setIsSubmitting(true);
      
      // Prepare the data for submission
      const entryData = {
        id: uuidv4(),
        pet_id: data.pet_id,
        food_name: data.food_name,
        food_type: data.food_type,
        date: data.date,
        notes: data.notes || null,
      };
      
      // Insert into food_entries table
      const { error } = await supabase
        .from("food_entries")
        .insert(entryData);
      
      if (error) throw error;
      
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
  
  return (
    <MobileLayout
      title="Add Food Entry"
      showBackButton
      onBack={() => navigate("/food-diary")}
    >
      <PatternBackground color="primary">
        <div className="space-y-6 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Food Entry"}
            </Button>
          </form>
        </div>
      </PatternBackground>
    </MobileLayout>
  );
};

export default AddFoodEntry;
