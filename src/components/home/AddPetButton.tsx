
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

const AddPetButton: React.FC = () => {
  const navigate = useNavigate();

  const handleAddPet = () => {
    navigate("/pets"); // Changed from /add-pet to /pets
  };

  return (
    <div className="mt-6 mb-10">
      <Button 
        onClick={handleAddPet}
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md"
        size="lg"
      >
        <PawPrint className="mr-2 h-5 w-5" />
        Add Your First Pet
      </Button>
      <p className="text-center text-sm text-muted-foreground mt-2">
        Start by adding your pet's information
      </p>
    </div>
  );
};

export default AddPetButton;
