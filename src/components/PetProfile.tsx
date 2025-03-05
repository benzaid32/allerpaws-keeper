
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pet } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Edit, Dog, Cat, Rabbit } from "lucide-react";

interface PetProfileProps {
  pet: Pet;
  onEdit?: () => void;
  className?: string;
}

const PetProfile: React.FC<PetProfileProps> = ({ pet, onEdit, className }) => {
  // Get the appropriate icon based on pet species
  const PetIcon = pet.species === "dog" ? Dog : pet.species === "cat" ? Cat : Rabbit;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative">
        {/* Profile Background */}
        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10"></div>
        
        {/* Pet Avatar */}
        <div className="absolute bottom-0 left-6 transform translate-y-1/2">
          <div className="w-20 h-20 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center">
            <PetIcon className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        {/* Edit Button */}
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <CardContent className="pt-12 pb-4">
        <div className="space-y-4">
          {/* Pet Name and Species */}
          <div>
            <h3 className="text-2xl font-bold">{pet.name}</h3>
            <p className="text-muted-foreground capitalize">{pet.species}</p>
          </div>
          
          {/* Known Allergies */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Known Allergies</h4>
            {pet.knownAllergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pet.knownAllergies.map((allergen) => (
                  <Badge variant="outline" key={allergen} className="bg-destructive/10">
                    {allergen}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No known allergies recorded</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetProfile;
