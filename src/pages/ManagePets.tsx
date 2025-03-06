import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pet } from "@/lib/types";
import BottomNavigation from "@/components/BottomNavigation";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import PremiumFeatureLimit from "@/components/subscription/PremiumFeatureLimit";

const ManagePets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { maxAllowedPets, isPremium } = useSubscriptionContext();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("pets")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the pet data to match our Pet type
        const transformedPets = (data || []).map((pet) => ({
          id: pet.id,
          name: pet.name,
          species: pet.species as "dog" | "cat" | "other",
          breed: pet.breed || undefined,
          age: pet.age || undefined,
          weight: pet.weight || undefined,
          knownAllergies: [], // Fetch allergies separately if needed
          imageUrl: pet.image_url || undefined,
        } as Pet));

        setPets(transformedPets);
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

    fetchPets();
  }, [user?.id, toast]);

  const handleDeletePet = async (petId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId);

      if (error) {
        throw error;
      }

      setPets(pets.filter((pet) => pet.id !== petId));
      toast({
        title: "Success",
        description: "Pet deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting pet:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete the pet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Manage Pets</h1>
      </div>

      <div className="space-y-6">
        {!isPremium && pets.length >= maxAllowedPets && (
          <PremiumFeatureLimit
            title="Pet Limit Reached"
            description={`Free accounts are limited to ${maxAllowedPets} pets. Upgrade to Premium for unlimited pet profiles.`}
          />
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : pets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <Card key={pet.id}>
                <CardHeader>
                  <CardTitle>{pet.name}</CardTitle>
                  <CardDescription className="capitalize">{pet.species}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/edit-pet/${pet.id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePet(pet.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <h3 className="text-lg font-medium mb-2">No pets yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first pet to AllerPaws.
            </p>
          </div>
        )}

        <Button 
          onClick={() => navigate("/add-pet")} 
          className="w-full" 
          disabled={!isPremium && pets.length >= maxAllowedPets}
        >
          <Plus className="mr-2 h-4 w-4" /> 
          Add New Pet
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ManagePets;
