
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pet } from "@/lib/types";
import { PawPrint, Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const ManagePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      // Fetch pets
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("*")
        .order("created_at", { ascending: false });

      if (petsError) {
        throw petsError;
      }

      // For each pet, fetch its allergies
      const petsWithAllergies = await Promise.all(
        (petsData || []).map(async (pet) => {
          const { data: allergiesData, error: allergiesError } = await supabase
            .from("allergies")
            .select("name")
            .eq("pet_id", pet.id);
            
          if (allergiesError) {
            console.error("Error fetching allergies:", allergiesError);
            return {
              ...pet,
              knownAllergies: [],
            } as Pet;
          }

          // Transform the pet data to match our Pet type
          return {
            id: pet.id,
            name: pet.name,
            species: pet.species as "dog" | "cat" | "other",
            breed: pet.breed || undefined,
            age: pet.age || undefined,
            weight: pet.weight || undefined,
            knownAllergies: allergiesData?.map((allergy) => allergy.name) || [],
            imageUrl: pet.image_url || undefined,
          } as Pet;
        })
      );

      setPets(petsWithAllergies);
    } catch (error: any) {
      console.error("Error fetching pets:", error.message);
      toast({
        title: "Error",
        description: "Failed to load your pets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    navigate("/pet/add");
  };

  const handleEditPet = (petId: string) => {
    navigate(`/pet/${petId}/edit`);
  };

  const handleViewPet = (petId: string) => {
    navigate(`/pet/${petId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Manage Your Pets</h1>
      </div>

      <div className="mb-6">
        <Button 
          onClick={handleAddPet}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          {pets.length === 0 ? "Add Your First Pet" : "Add New Pet"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <Card 
                key={pet.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div 
                      className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4 flex-shrink-0"
                      onClick={() => handleViewPet(pet.id)}
                    >
                      {pet.imageUrl ? (
                        <img 
                          src={pet.imageUrl} 
                          alt={pet.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <PawPrint className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-1" onClick={() => handleViewPet(pet.id)}>
                      <h3 className="font-semibold text-lg">{pet.name}</h3>
                      <p className="text-muted-foreground capitalize">{pet.species} {pet.breed ? `• ${pet.breed}` : ''}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditPet(pet.id)}
                        className="h-9 w-9"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <div className="rounded-full bg-primary/10 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <PawPrint className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No pets yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding your first pet to AllerPaws.
              </p>
            </div>
          )}
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default ManagePets;
