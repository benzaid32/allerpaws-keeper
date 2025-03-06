
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint, Plus } from "lucide-react";

const AddPetButton: React.FC<{ hasPets: boolean }> = ({ hasPets }) => {
  const navigate = useNavigate();

  const handleManagePets = () => {
    navigate("/pets");
  };

  return (
    <div className="mt-6 mb-10">
      <Button 
        onClick={handleManagePets}
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md"
        size="lg"
      >
        <PawPrint className="mr-2 h-5 w-5" />
        {hasPets ? "Manage Your Pets" : "Add Your First Pet"}
      </Button>
      <p className="text-center text-sm text-muted-foreground mt-2">
        {hasPets 
          ? "Add, edit or view your pets' information" 
          : "Start by adding your pet's information"}
      </p>
    </div>
  );
};

export default AddPetButton;
