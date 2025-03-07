
import React from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileCard from "@/components/ui/mobile-card";

const PetManagementCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <MobileCard
      icon={<PawPrint className="h-5 w-5 text-primary" />}
      title="Pet Management"
    >
      <p className="text-muted-foreground mb-4">Add, edit, or manage your pets</p>
      <Button 
        onClick={() => navigate("/pets")} 
        className="w-full"
        variant="outline"
      >
        <PawPrint className="mr-2 h-4 w-4" />
        Manage Pets
      </Button>
    </MobileCard>
  );
};

export default PetManagementCard;
