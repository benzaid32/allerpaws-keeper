
import React, { useState } from "react";
import { Pet } from "@/lib/types";
import MobileCard from "@/components/ui/mobile-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PetActionMenu } from "./PetActionMenu";
import { PLACEHOLDER_IMAGES } from "@/lib/image-utils";
import { motion } from "framer-motion";

interface PetCardProps {
  pet: Pet;
  onViewPet: (petId: string) => void;
  onEditPet: (petId: string) => void;
  onDeletePet: (petId: string) => void;
  isDeleting: boolean;
  deletingPetId: string | null;
  compact?: boolean;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onViewPet,
  onEditPet,
  onDeletePet,
  isDeleting,
  deletingPetId,
  compact = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!pet.imageUrl);
  
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
      className={`hover:border-primary/30 transition-all overflow-visible ${compact ? 'py-2 px-3' : ''}`}
    >
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className={`relative ${compact ? 'h-10 w-10' : 'h-14 w-14'}`}>
            <Avatar className={`${compact ? 'h-10 w-10' : 'h-14 w-14'} border border-muted shadow-sm ${imageLoading ? 'animate-pulse bg-muted' : ''}`}>
              {pet.imageUrl && !imageError ? (
                <>
                  {imageLoading && (
                    <AvatarFallback className="absolute inset-0 bg-primary/10">
                      {pet.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                  <AvatarImage 
                    src={getImageUrl()} 
                    alt={pet.name} 
                    onError={(e) => {
                      console.error("Failed to load pet image:", pet.imageUrl);
                      setImageError(true);
                      setImageLoading(false);
                    }}
                    onLoad={() => setImageLoading(false)}
                    className="object-cover"
                  />
                </>
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {pet.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            
            {pet.species && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`absolute -bottom-1 -right-1 ${compact ? 'h-4 w-4' : 'h-5 w-5'} rounded-full bg-white shadow-sm border border-muted flex items-center justify-center`}
              >
                <span className="text-xs" aria-label={`Pet type: ${pet.species}`}>
                  {pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐾'}
                </span>
              </motion.div>
            )}
          </div>
          
          <div>
            <h3 className={`font-semibold ${compact ? 'text-base' : 'text-lg'}`}>{pet.name}</h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
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
      
      {!compact && pet.knownAllergies && pet.knownAllergies.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <span className="text-xs text-muted-foreground block mb-1.5">Allergies:</span>
          <div className="flex flex-wrap gap-1.5">
            {pet.knownAllergies.map((allergy, idx) => (
              <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs py-0">
                {allergy}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </MobileCard>
  );
};
