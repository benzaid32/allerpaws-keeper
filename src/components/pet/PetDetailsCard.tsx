
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pet } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { markUserChanges } from "@/lib/sync-utils";

interface PetDetailsCardProps {
  pet: Pet;
  setPet: React.Dispatch<React.SetStateAction<Pet | null>>;
}

const PetDetailsCard: React.FC<PetDetailsCardProps> = ({ pet, setPet }) => {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: pet.name,
    species: pet.species,
    breed: pet.breed || "",
    age: pet.age?.toString() || "",
    weight: pet.weight?.toString() || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSpeciesChange = (value: "dog" | "cat" | "other") => {
    setFormData((prev) => ({ ...prev, species: value }));
  };

  const savePetChanges = async () => {
    try {
      setSaving(true);
      
      // Build the update object with type safety
      const updateData: {
        name: string;
        species: "dog" | "cat" | "other";
        breed?: string | null;
        age?: number | null;
        weight?: number | null;
      } = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed || null,
        age: formData.age ? parseInt(formData.age, 10) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };
      
      const { error } = await supabase
        .from("pets")
        .update(updateData)
        .filter("id", "eq", pet.id);
        
      if (error) throw error;
      
      // Update local state
      setPet((prev) => prev ? {
        ...prev,
        name: formData.name,
        species: formData.species,
        breed: formData.breed || undefined,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
      } : null);
      
      // Mark changes for sync and trigger refresh
      markUserChanges('pets');
      
      setEditing(false);
      
      toast({
        title: "Changes saved",
        description: `Updated ${formData.name}'s information.`,
      });
    } catch (error: any) {
      console.error("Error updating pet:", error.message);
      toast({
        title: "Error",
        description: "Could not save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Pet Details
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel" : "Edit"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Select
                value={formData.species}
                onValueChange={(val) => handleSpeciesChange(val as "dog" | "cat" | "other")}
              >
                <SelectTrigger id="species">
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{pet.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Species</p>
                <p className="font-medium capitalize">{pet.species}</p>
              </div>
              
              {pet.breed && (
                <div>
                  <p className="text-sm text-muted-foreground">Breed</p>
                  <p className="font-medium">{pet.breed}</p>
                </div>
              )}
              
              {pet.age !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{pet.age} years</p>
                </div>
              )}
              
              {pet.weight !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium">{pet.weight} kg</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      {editing && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={savePetChanges} 
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PetDetailsCard;
