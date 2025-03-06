
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import FoodAnalyzer from "@/components/FoodAnalyzer";
import PetDetailsCard from "@/components/pet/PetDetailsCard";
import AllergiesCard from "@/components/pet/AllergiesCard";
import PetProfileSkeleton from "@/components/pet/PetProfileSkeleton";

const PetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <PetProfileSkeleton onBack={() => navigate(-1)} />;
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
            <PetDetailsCard pet={pet} setPet={setPet} />
            <AllergiesCard pet={pet} setPet={setPet} />
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
