
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { Pet } from "@/lib/types";
import { supabase, isQueryError } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AllergiesCardProps {
  pet: Pet;
  setPet: React.Dispatch<React.SetStateAction<Pet | null>>;
}

const AllergiesCard: React.FC<AllergiesCardProps> = ({ pet, setPet }) => {
  const { toast } = useToast();
  const [newAllergen, setNewAllergen] = useState("");

  const addAllergy = async () => {
    if (!newAllergen.trim()) return;
    
    try {
      const { error } = await supabase
        .from("allergies")
        .insert({
          pet_id: pet.id,
          name: newAllergen.trim(),
          severity: "unknown" // Adding required severity field
        });
        
      if (error) throw error;
      
      // Update local state
      setPet((prev) => prev ? {
        ...prev,
        knownAllergies: [...prev.knownAllergies, newAllergen.trim()]
      } : null);
      
      setNewAllergen("");
      
      toast({
        title: "Allergen added",
        description: `Added ${newAllergen} to ${pet.name}'s allergies.`,
      });
    } catch (error: any) {
      console.error("Error adding allergen:", error.message);
      toast({
        title: "Error",
        description: "Could not add allergen",
        variant: "destructive",
      });
    }
  };
  
  const removeAllergy = async (allergen: string) => {
    try {
      const { error } = await supabase
        .from("allergies")
        .delete()
        .filter("pet_id", "eq", pet.id)
        .filter("name", "eq", allergen);
        
      if (error) throw error;
      
      // Update local state
      setPet((prev) => prev ? {
        ...prev,
        knownAllergies: prev.knownAllergies.filter(a => a !== allergen)
      } : null);
      
      toast({
        title: "Allergen removed",
        description: `Removed ${allergen} from ${pet.name}'s allergies.`,
      });
    } catch (error: any) {
      console.error("Error removing allergen:", error.message);
      toast({
        title: "Error",
        description: "Could not remove allergen",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Known Allergies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pet.knownAllergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pet.knownAllergies.map((allergen) => (
                <Badge 
                  key={allergen} 
                  variant="outline"
                  className="flex items-center gap-1 py-1.5"
                >
                  {allergen}
                  <button
                    onClick={() => removeAllergy(allergen)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No known allergies recorded yet.</p>
          )}
          
          <Separator />
          
          <div className="flex gap-2">
            <Input
              placeholder="Add new allergen"
              value={newAllergen}
              onChange={(e) => setNewAllergen(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAllergy()}
            />
            <Button 
              onClick={addAllergy}
              disabled={!newAllergen.trim()}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllergiesCard;
