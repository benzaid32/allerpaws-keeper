
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pet } from "@/lib/types";
import { LogOut } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import PetDetailsView from "@/components/dashboard/PetDetailsView";
import PetListView from "@/components/dashboard/PetListView";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: petId } = useParams<{ id?: string }>();

  useEffect(() => {
    const fetchPets = async () => {
      try {
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
        
        // If a pet ID is provided in the URL, set it as the selected pet
        if (petId) {
          const selectedPet = petsWithAllergies.find(pet => pet.id === petId);
          if (selectedPet) {
            setSelectedPet(selectedPet);
          } else {
            console.error("Pet not found with ID:", petId);
            toast({
              title: "Pet Not Found",
              description: "The selected pet could not be found.",
              variant: "destructive",
            });
          }
        }
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
  }, [toast, petId]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleManagePets = () => {
    navigate("/pets");
  };

  const handleBackToAllPets = () => {
    setSelectedPet(null);
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.user_metadata.full_name || "Pet Parent"}!</h2>
        <p className="text-muted-foreground">
          Track and manage your pet's food allergies with AllerPaws.
        </p>
      </div>

      {selectedPet ? (
        <PetDetailsView pet={selectedPet} onBack={handleBackToAllPets} />
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <PetListView pets={pets} onManagePets={handleManagePets} />
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
