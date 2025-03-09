
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooter from "@/components/auth/AuthFooter";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PatternBackground from "@/components/ui/pattern-background";
import MobileLayout from "@/components/layout/MobileLayout";
import MobileCard from "@/components/ui/mobile-card";
import { motion } from "framer-motion";

const Auth = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Check if signup parameter is in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const signup = searchParams.get("signup");
    if (signup === "true") {
      setIsSignUp(true);
    }
  }, [location]);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate("/", { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-lg font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Content for both desktop and mobile
  const authContent = (
    <>
      <motion.div 
        className="w-full space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-2">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-[#033b5c]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isSignUp 
              ? "Join AllerPaws and start managing your pet's allergies today."
              : "Sign in to access your AllerPaws dashboard."}
          </motion.p>
        </div>
        
        <motion.div 
          className="transform hover:scale-[1.01] transition-all duration-300"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AuthForm initialView={isSignUp ? "sign-up" : "sign-in"} />
        </motion.div>
        
        <motion.div 
          className="flex justify-center space-x-6 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <img 
            src="/lovable-uploads/0bc9c4dc-86db-4bac-8ed9-9b00a727811b.png" 
            alt="Happy dog" 
            className="h-24 md:h-32 transform -rotate-6 hover:rotate-0 transition-all duration-300"
          />
          <img 
            src="/lovable-uploads/bfe8fffa-8ddd-4e75-83bb-d78b9fc09201.png" 
            alt="Tabby cat" 
            className="h-24 md:h-32 transform rotate-6 hover:rotate-0 transition-all duration-300"
          />
        </motion.div>
      </motion.div>
    </>
  );

  // Responsive design for both mobile and desktop
  return (
    <div className="min-h-screen flex flex-col md:justify-between bg-[#a4e1e9] overflow-hidden">
      <AuthHeader />
      
      {/* Desktop version */}
      <div className="hidden md:block flex-1">
        <main className="flex-1 flex items-center justify-center p-4 relative">
          <PatternBackground opacity={0.04} color="primary">
            <div className="container mx-auto max-w-md px-4 py-8">
              {authContent}
            </div>
          </PatternBackground>
        </main>
      </div>
      
      {/* Mobile version with optimized layout */}
      <div className="md:hidden flex-1">
        <MobileLayout 
          hideNavigation={true} 
          fullWidth={false} 
          className="bg-[#a4e1e9] pt-0"
          contentClassName="justify-center items-center"
        >
          <MobileCard 
            className="w-full mx-auto max-w-md bg-white/80 backdrop-blur-sm border-none rounded-2xl shadow-lg overflow-hidden"
            variant="ghost"
            noPadding
          >
            <div className="px-4 py-8">
              {authContent}
            </div>
          </MobileCard>
        </MobileLayout>
      </div>
      
      <AuthFooter />
    </div>
  );
};

export default Auth;
