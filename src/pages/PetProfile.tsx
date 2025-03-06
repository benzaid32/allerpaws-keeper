
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
    if (!id) {
      console.error("PetProfile: No ID parameter found in URL");
      navigate("/dashboard");
      return;
    }
    
    const fetchPet = async () => {
      try {
        console.log("PetProfile: Fetching pet with ID:", id);
        setLoading(true);
        
        // Fetch pet data
        const { data: petData, error: petError } = await supabase
          .from("pets")
          .select("*")
          .eq("id", id)
          .single();
          
        if (petError) {
          console.error("PetProfile: Error fetching pet data:", petError);
          throw petError;
        }
        
        if (!petData) {
          console.error("PetProfile: No pet found with ID:", id);
          throw new Error("Pet not found");
        }
        
        // Fetch allergies for this pet
        const { data: allergiesData, error: allergiesError } = await supabase
          .from("allergies")
          .select("name, severity")
          .eq("pet_id", id);
          
        if (allergiesError) {
          console.error("PetProfile: Error fetching allergies:", allergiesError);
          throw allergiesError;
        }
        
        // Transform to match our Pet type
        const fullPet: Pet = {
          id: petData.id,
          name: petData.name,
          species: petData.species as "dog" | "cat" | "other",
          breed: petData.breed || undefined,
          age: petData.age || undefined,
          weight: petData.weight || undefined,
          knownAllergies: allergiesData?.map((a) => a.name) || [],
          imageUrl: petData.image_url || undefined,
        };
        
        console.log("PetProfile: Successfully loaded pet data:", fullPet.name);
        setPet(fullPet);
      } catch (error: any) {
        console.error("PetProfile: Error fetching pet:", error.message);
        toast({
          title: "Error",
          description: "Could not load pet information",
          variant: "destructive",
        });
        
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPet();
  }, [id, toast, navigate]);

  if (loading) {
    return <PetProfileSkeleton onBack={() => navigate(-1)} />;
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <img 
          src="/lovable-uploads/ac2e5c6c-4c6f-43e5-826f-709eba1f1a9d.png" 
          alt="AllerPaws Logo" 
          className="w-24 h-24 mx-auto mb-4"
        />
        <p className="text-xl font-semibold">Pet not found.</p>
        <p className="text-gray-500 mb-4">We couldn't find a pet with that ID.</p>
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
