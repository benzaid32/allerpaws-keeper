
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FoodProduct } from "@/lib/types";

// Interface for form data
interface FoodEntryFormData {
  pet_id: string;
  food_name: string;
  food_type: string;
  date: string;
  notes?: string;
}

interface ManualEntryFormProps {
  onSubmit: (data: FoodEntryFormData) => Promise<void>;
  pets: { id: string; name: string }[];
  isSubmitting: boolean;
  selectedFood: FoodProduct | null;
  onClearSelectedFood: () => void;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  onSubmit,
  pets,
  isSubmitting,
  selectedFood,
  onClearSelectedFood
}) => {
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
  React.useEffect(() => {
    if (selectedFood) {
      setValue("food_name", selectedFood.name);
      setValue("food_type", selectedFood.type.toLowerCase() || "regular");
    }
  }, [selectedFood, setValue]);
  
  return (
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
            onClick={onClearSelectedFood}
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
  );
};

export default ManualEntryForm;
