
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SymptomEntryForm from "@/components/SymptomEntryForm";
import { supabase } from "@/integrations/supabase/client";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";

const NewSymptomEntry = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<{ id: string; name: string }[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchPets = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("pets")
          .select("id, name")
          .eq("user_id", user.id)
          .order("name");

        if (error) throw error;

        setPets(data || []);
        if (data && data.length > 0) {
          setSelectedPetId(data[0].id);
        }
      } catch (error: any) {
        console.error("Error fetching pets:", error.message);
        toast({
          title: "Error",
          description: "Could not load your pets. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [user, toast]);

  const handleSuccess = () => {
    navigate("/symptom-diary");
  };

  const handlePetChange = (petId: string) => {
    setSelectedPetId(petId);
  };

  return (
    <div className="container pb-20">
      <div className="pt-6 pb-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">New Symptom Entry</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Symptom Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : pets.length > 0 ? (
            <>
              {pets.length > 1 && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {pets.map((pet) => (
                    <Button
                      key={pet.id}
                      variant={selectedPetId === pet.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePetChange(pet.id)}
                    >
                      {pet.name}
                    </Button>
                  ))}
                </div>
              )}
              {selectedPetId && (
                <SymptomEntryForm
                  petId={selectedPetId}
                  onSuccess={handleSuccess}
                />
              )}
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="mb-4">You need to add a pet first to track symptoms.</p>
              <Button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <BottomNavigation />
    </div>
  );
};

export default NewSymptomEntry;
