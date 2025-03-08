
import React from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import BottomNavigation from "@/components/BottomNavigation";

const DashboardLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-blue-50/30 to-primary/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LoadingSpinner className="scale-125" />
      </motion.div>
      <motion.p 
        className="text-sm text-muted-foreground mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Loading your dashboard...
      </motion.p>
      <BottomNavigation />
    </div>
  );
};

export default DashboardLoading;
