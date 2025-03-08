
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AuthFooter: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.div 
      className="w-full py-6 text-center text-sm text-[#033b5c]/70 bg-white/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto">
        <p>© {currentYear} Aller Paws. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <button 
            onClick={() => navigate("/privacy")} 
            className="text-[#33c1db] hover:underline"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => navigate("/terms")} 
            className="text-[#33c1db] hover:underline"
          >
            Terms of Service
          </button>
          <button 
            onClick={() => navigate("/")} 
            className="text-[#33c1db] hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthFooter;
