
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut, ArrowRight } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import PetDetailsView from "@/components/dashboard/PetDetailsView";
import PetListView from "@/components/dashboard/PetListView";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePets } from "@/hooks/use-pets";
import { APP_NAME } from "@/lib/constants";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 overflow-x-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/ac2e5c6c-4c6f-43e5-826f-709eba1f1a9d.png" 
              alt={APP_NAME} 
              className="w-8 h-8 mr-3" 
            />
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <Button variant="outline" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.user_metadata.full_name || "Pet Parent"}!</h2>
          <p className="text-muted-foreground">
            Track and manage your pet's food allergies with {APP_NAME}.
          </p>
        </motion.div>

        {selectedPet ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <PetDetailsView pet={selectedPet} onBack={handleBackToAllPets} />
          </motion.div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner className="h-12 w-12" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <PetListView pets={pets} onManagePets={handleManagePets} />
          </motion.div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
