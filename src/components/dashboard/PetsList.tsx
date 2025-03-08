
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pet } from "@/lib/types";
import { PawPrint, Heart } from "lucide-react";

interface PetsListProps {
  pets: Pet[];
}

const PetsList: React.FC<PetsListProps> = ({ pets }) => {
  const navigate = useNavigate();

  if (pets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="border-dashed bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <PawPrint className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-medium text-lg">No pets yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Add your first pet to start tracking their allergies and symptoms
              </p>
            </div>
            <Button 
              onClick={() => navigate('/add-pet')} 
              className="mt-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md"
            >
              Add Your First Pet
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pets.map((pet, index) => (
        <motion.div
          key={pet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
        >
          <Card 
            className="cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary/10 overflow-hidden"
            onClick={() => navigate(`/edit-pet/${pet.id}`)}
          >
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shadow-sm">
                    {pet.imageUrl ? (
                      <img 
                        src={pet.imageUrl} 
                        alt={pet.name} 
                        className="h-full w-full object-cover" 
                        onError={(e) => {
                          // If image fails to load, fallback to the first letter
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<span class="text-lg font-bold">${pet.name.charAt(0)}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-lg font-bold">{pet.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{pet.species}</p>
                  </div>
                </div>
                
                {pet.knownAllergies && pet.knownAllergies.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center mb-2">
                      <Heart className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-sm text-muted-foreground">Allergies: </span> 
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pet.knownAllergies.slice(0, 3).map((allergy, idx) => (
                        <span key={idx} className="text-xs bg-red-100 text-red-800 rounded-full px-2 py-1">
                          {allergy}
                        </span>
                      ))}
                      {pet.knownAllergies.length > 3 && (
                        <span className="text-xs bg-muted rounded-full px-2 py-1">
                          +{pet.knownAllergies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </motion.div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PetsList;
