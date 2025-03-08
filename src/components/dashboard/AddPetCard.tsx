
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const AddPetCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card 
        className="border-dashed cursor-pointer hover:bg-primary/5 transition-colors bg-white/60 dark:bg-gray-800/60"
        onClick={() => navigate('/add-pet')}
      >
        <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <CardContent className="flex flex-col items-center justify-center h-full py-10">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium">Add New Pet</p>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default AddPetCard;
