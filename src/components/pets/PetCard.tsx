
import React, { useState } from "react";
import { Pet } from "@/lib/types";
import MobileCard from "@/components/ui/mobile-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PetActionMenu } from "./PetActionMenu";
import { PLACEHOLDER_IMAGES } from "@/lib/image-utils";

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
  const [imageError, setImageError] = useState(false);
  
  // Force a unique URL with a cache buster to prevent stale images
  const getImageUrl = () => {
    if (!pet.imageUrl || imageError) return null;
    
    // Add a timestamp as a query parameter to bust cache
    const cacheBuster = `?t=${Date.now()}`;
    
    // If URL already has query parameters, append the cache buster
    if (pet.imageUrl.includes('?')) {
      return `${pet.imageUrl}&cb=${cacheBuster}`;
    }
    
    return `${pet.imageUrl}${cacheBuster}`;
  };

  return (
    <MobileCard
      key={pet.id}
      onClick={() => onViewPet(pet.id)}
      className="hover:border-primary/30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-muted">
            {pet.imageUrl && !imageError ? (
              <AvatarImage 
                src={getImageUrl()} 
                alt={pet.name} 
                onError={(e) => {
                  console.error("Failed to load pet image:", pet.imageUrl);
                  setImageError(true);
                }}
              />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {pet.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
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
