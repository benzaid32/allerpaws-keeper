
import React from "react";
import MobileCard from "@/components/ui/mobile-card";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

interface EmptyPetsListProps {
  onAddPet: () => void;
}

export const EmptyPetsList: React.FC<EmptyPetsListProps> = ({ onAddPet }) => {
  return (
    <MobileCard className="border-dashed border-muted-foreground/30">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="rounded-full bg-primary/10 p-3 mb-3">
          <PawPrint className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-medium text-lg mb-1">No pets yet</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Add your first pet to start tracking their allergies and symptoms
        </p>
        <Button onClick={onAddPet}>
          Add Your First Pet
        </Button>
      </div>
    </MobileCard>
  );
};
