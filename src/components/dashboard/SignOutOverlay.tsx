import React from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const SignOutOverlay: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-blue-50/30 to-primary/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <LoadingSpinner className="scale-125" />
          <motion.p 
            className="text-lg font-medium mt-6 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Signing out...
          </motion.p>
          <h2 className="text-xl font-medium text-center">
            Thank you for using Aller Paws!
          </h2>
        </div>
      </motion.div>
    </div>
  );
};

export default SignOutOverlay;
