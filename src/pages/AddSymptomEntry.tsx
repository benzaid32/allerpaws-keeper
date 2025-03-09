
import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PawPrint } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import SymptomEntryForm from "@/components/SymptomEntryForm";

const AddSymptomEntry = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50/50 dark:from-background dark:to-blue-950/20">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-full h-64 bg-[url('/lovable-uploads/9575c134-213b-4839-b573-65f38dc28955.png')] bg-no-repeat bg-right-top bg-contain opacity-10 dark:opacity-5 z-0"></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-400/10 dark:text-purple-400/5"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -20, 
              opacity: 0,
              rotate: Math.random() * 180 - 90
            }}
            animate={{ 
              y: window.innerHeight + 50,
              opacity: [0, 0.6, 0],
              rotate: Math.random() * 360 - 180
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 25 + Math.random() * 20,
              delay: Math.random() * 15,
              ease: "linear"
            }}
          >
            <PawPrint size={20 + Math.random() * 30} />
          </motion.div>
        ))}
      </div>
      
      <div className="container relative pb-20 pt-4 z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-2 text-purple-700 dark:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              New Symptom Entry
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border border-purple-100/50 dark:border-purple-900/20 shadow-sm bg-white/90 dark:bg-card/90 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-purple-900 dark:text-purple-300">
                Enter Symptom Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NewSymptomEntry />
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <BottomNavigation />
    </div>
  );
};

const NewSymptomEntry = () => {
  return <SymptomEntryForm />;
};

export default AddSymptomEntry;
