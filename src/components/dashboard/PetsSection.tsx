
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pet } from "@/lib/types";
import { PawPrint } from "lucide-react";
import PetsList from "./PetsList";
import AddPetCard from "./AddPetCard";

interface PetsSectionProps {
  pets: Pet[];
}

const PetsSection: React.FC<PetsSectionProps> = ({ pets }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <PawPrint className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium">Your Pets</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/pets')} 
          className="text-primary hover:bg-primary/10"
        >
          Manage
        </Button>
      </div>

      {pets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <PetsList pets={pets} />
          <AddPetCard />
        </div>
      ) : (
        <PetsList pets={pets} />
      )}
    </motion.div>
  );
};

export default PetsSection;
