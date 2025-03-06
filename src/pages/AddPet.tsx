
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";

interface PetFormData {
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  allergies: string[];
}

const AddPet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    species: "dog",
    breed: "",
    age: "",
    weight: "",
    allergies: [],
  });
  const [currentAllergy, setCurrentAllergy] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addAllergy = () => {
    if (!currentAllergy.trim()) return;
    
    // Check if already exists
    if (formData.allergies.includes(currentAllergy.trim())) {
      toast({
        title: "Allergen already added",
        description: "This allergen is already in the list",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      allergies: [...prev.allergies, currentAllergy.trim()]
    }));
    setCurrentAllergy("");
  };

  const removeAllergy = (allergyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergyToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to add a pet",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Add pet info
      const { data: petData, error: petError } = await supabase
        .from("pets")
        .insert({
          user_id: user.id,
          name: formData.name,
          species: formData.species,
          breed: formData.breed || null,
          age: formData.age ? parseInt(formData.age) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        })
        .select()
        .single();
        
      if (petError) throw petError;
      
      // Add allergies if any
      if (formData.allergies.length > 0) {
        const allergiesToInsert = formData.allergies.map(name => ({
          pet_id: petData.id,
          name,
          severity: "unknown",
        }));
        
        const { error: allergiesError } = await supabase
          .from("allergies")
          .insert(allergiesToInsert);
          
        if (allergiesError) throw allergiesError;
      }
      
      toast({
        title: "Pet added",
        description: `${formData.name} has been added to your pets`,
      });
      
      navigate(`/pet/${petData.id}`);
    } catch (error: any) {
      console.error("Error adding pet:", error.message);
      toast({
        title: "Error",
        description: "Failed to add pet",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container pt-6 pb-20">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Pet</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Pet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Select
                value={formData.species}
                onValueChange={(value) => handleSelectChange("species", value)}
              >
                <SelectTrigger>
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
              <Label htmlFor="breed">Breed (Optional)</Label>
              <Input
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age in Years (Optional)</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight in lbs (Optional)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Known Allergies or Sensitivities</Label>
              <div className="flex gap-2">
                <Input
                  value={currentAllergy}
                  onChange={(e) => setCurrentAllergy(e.target.value)}
                  placeholder="Add an allergen"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAllergy();
                    }
                  }}
                />
                <Button type="button" onClick={addAllergy} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.allergies.map((allergy) => (
                    <Badge key={allergy} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                      <span>{allergy}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-muted"
                        onClick={() => removeAllergy(allergy)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Pet...
                </>
              ) : (
                "Add Pet"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <BottomNavigation />
    </div>
  );
};

export default AddPet;
