
import React from "react";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";

interface DashboardBackgroundProps {
  children: React.ReactNode;
}

// Dashboard background image URL
const DASHBOARD_BG_IMAGE = "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/sign/allerpaws/allerpaws%20home%20page.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhbGxlcnBhd3MvYWxsZXJwYXdzIGhvbWUgcGFnZS5qcGciLCJpYXQiOjE3NDEyOTkzNDQsImV4cCI6MTc0MTY0NDk0NH0.QTBFktOpZjaxj3bJkxscmSWg7sLdHR0AIp4IvjISmvU";

const DashboardBackground: React.FC<DashboardBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${DASHBOARD_BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Overlay to ensure content readability */}
      <div className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-sm"></div>
      
      {/* Floating paw prints */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -20, 
              opacity: 0,
              rotate: Math.random() * 180 - 90
            }}
            animate={{ 
              y: window.innerHeight + 50,
              opacity: [0, 0.3, 0],
              rotate: Math.random() * 360 - 180
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 25 + Math.random() * 20,
              delay: Math.random() * 15,
              ease: "linear"
            }}
          >
            <PawPrint size={20 + Math.random() * 20} />
          </motion.div>
        ))}
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400/10 to-primary/10 blur-3xl -z-10"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-purple-400/5 to-pink-400/5 blur-3xl -z-10"
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 pb-20">
        {children}
      </div>
    </div>
  );
};

export default DashboardBackground;
