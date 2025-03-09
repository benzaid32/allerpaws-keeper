
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus } from "lucide-react";

const SymptomEmptyState = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-12 px-4 bg-white/60 dark:bg-muted/30 backdrop-blur-sm rounded-lg border border-purple-100/50 dark:border-purple-900/20 shadow-sm"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 mb-4 text-purple-600 dark:text-purple-400">
        <ClipboardList className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
        No symptom logs found
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Start tracking your pet's symptoms to identify potential food allergies and health issues.
      </p>
      <Button 
        onClick={() => navigate("/symptom-diary/new")}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create First Entry
      </Button>
    </motion.div>
  );
};

export default SymptomEmptyState;
