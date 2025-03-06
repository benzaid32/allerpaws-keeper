
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import PetDetailsView from "@/components/dashboard/PetDetailsView";
import PetListView from "@/components/dashboard/PetListView";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePets } from "@/hooks/use-pets";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { pets, loading, selectedPet, clearSelectedPet } = usePets();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    clearSelectedPet();
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
