import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Save, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import FoodAnalyzer from "@/components/FoodAnalyzer";

const PetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newAllergen, setNewAllergen] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    species: "dog" as "dog" | "cat" | "other",
    breed: "",
    age: "",
    weight: "",
  });

  useEffect(() => {
    if (!id) return;
    
    const fetchPet = async () => {
      try {
        setLoading(true);
        
        // Fetch pet data
        const { data: petData, error: petError } = await supabase
          .from("pets")
          .select("*")
          .eq("id", id)
          .single();
          
        if (petError) throw petError;
        
        // Fetch allergies for this pet
        const { data: allergiesData, error: allergiesError } = await supabase
          .from("allergies")
          .select("name, severity")
          .eq("pet_id", id);
          
        if (allergiesError) throw allergiesError;
        
        // Transform to match our Pet type
        const fullPet: Pet = {
          id: petData.id,
          name: petData.name,
          species: petData.species as "dog" | "cat" | "other",
          breed: petData.breed || undefined,
          age: petData.age || undefined,
          weight: petData.weight || undefined,
          knownAllergies: allergiesData.map((a) => a.name) || [],
          imageUrl: petData.image_url || undefined,
        };
        
        setPet(fullPet);
        
        // Initialize form data
        setFormData({
          name: fullPet.name,
          species: fullPet.species,
          breed: fullPet.breed || "",
          age: fullPet.age?.toString() || "",
          weight: fullPet.weight?.toString() || "",
        });
      } catch (error: any) {
        console.error("Error fetching pet:", error.message);
        toast({
          title: "Error",
          description: "Could not load pet information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPet();
  }, [id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSpeciesChange = (value: "dog" | "cat" | "other") => {
    setFormData((prev) => ({ ...prev, species: value }));
  };

  const addAllergy = async () => {
    if (!newAllergen.trim() || !pet) return;
    
    try {
      const { error } = await supabase
        .from("allergies")
        .insert({
          pet_id: pet.id,
          name: newAllergen.trim()
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
    if (!pet) return;
    
    try {
      const { error } = await supabase
        .from("allergies")
        .delete()
        .eq("pet_id", pet.id)
        .eq("name", allergen);
        
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

  const savePetChanges = async () => {
    if (!pet) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from("pets")
        .update({
          name: formData.name,
          species: formData.species,
          breed: formData.breed || null,
          age: formData.age ? parseInt(formData.age, 10) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        })
        .eq("id", pet.id);
        
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-48 rounded-md bg-muted animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 rounded-lg bg-muted animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 w-32 rounded-md bg-muted animate-pulse"></div>
            <div className="h-24 rounded-md bg-muted animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Pet not found.</p>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">{pet.name}'s Profile</h1>
      </div>

      <Tabs defaultValue="details" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="food">Food Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pet Details Card */}
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

            {/* Allergies Card */}
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
          </div>
        </TabsContent>
        
        <TabsContent value="food">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <FoodAnalyzer petId={pet.id} petName={pet.name} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PetProfile;
