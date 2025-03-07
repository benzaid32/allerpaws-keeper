
import React from "react";
import { Pet } from "@/lib/types";
import MobileCard from "@/components/ui/mobile-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PetActionMenu } from "./PetActionMenu";

interface PetCardProps {
  pet: Pet;
  onViewPet: (petId: string) => void;
  onEditPet: (petId: string) => void;
  onDeletePet: (petId: string) => void;
  isDeleting: boolean;
  deletingPetId: string | null;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onViewPet,
  onEditPet,
  onDeletePet,
  isDeleting,
  deletingPetId,
}) => {
  return (
    <MobileCard
      key={pet.id}
      onClick={() => onViewPet(pet.id)}
      className="hover:border-primary/30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {pet.imageUrl ? (
              <AvatarImage 
                src={pet.imageUrl} 
                alt={pet.name} 
                onError={(e) => {
                  // If image fails to load, show fallback
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
            )}
            <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{pet.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {pet.species}
              </Badge>
              {pet.breed && (
                <span className="text-xs text-muted-foreground">
                  {pet.breed}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <PetActionMenu
          pet={pet}
          onViewPet={onViewPet}
          onEditPet={onEditPet}
          onDeletePet={onDeletePet}
          isDeleting={isDeleting}
          deletingPetId={deletingPetId}
        />
      </div>
      
      {pet.knownAllergies && pet.knownAllergies.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <span className="text-sm text-muted-foreground block mb-2">Allergies: </span>
          <div className="flex flex-wrap gap-1">
            {pet.knownAllergies.map((allergy, idx) => (
              <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {allergy}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </MobileCard>
  );
};
