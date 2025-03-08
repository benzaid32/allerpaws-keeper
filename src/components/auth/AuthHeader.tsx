
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const AuthHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="w-full pt-4 px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto max-w-6xl flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="mr-2 text-[#033b5c] hover:bg-[#033b5c]/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <img 
            src="/lovable-uploads/a8a385c7-0e89-4d36-92bf-e69731a98a66.png" 
            alt="Aller Paws Logo" 
            className="h-10"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AuthHeader;
