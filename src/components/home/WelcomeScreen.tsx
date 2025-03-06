import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FeaturedImage from "@/components/ui/featured-image";

interface WelcomeScreenProps {
  showOnboarding: boolean;
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ showOnboarding, onGetStarted }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50/60 dark:from-background dark:to-blue-950/20 flex flex-col">
      <div className="flex-1 container px-4 py-8 flex flex-col">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-8"
        >
          <img 
            src="/lovable-uploads/ac2e5c6c-4c6f-43e5-826f-709eba1f1a9d.png" 
            alt="AllerPaws" 
            className="w-10 h-10 mr-3" 
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            AllerPaws
          </h1>
        </motion.div>
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <div className="max-w-lg mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Track, Manage & Prevent Pet Food Allergies
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              The complete solution for pet parents dealing with food allergies and sensitivities
            </p>
            
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Featured Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-8">
            <FeaturedImage 
              name="happyDogOwner"
              caption="Identify Safe Foods"
              description="Track reactions and find patterns to keep your pet healthy"
              height={220}
            />
            
            <FeaturedImage 
              name="stressedOwner"
              caption="From Frustration to Solution"
              description="No more guessing what's causing your pet's allergies"
              height={220}
            />
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Symptom Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Log and monitor your pet's symptoms to identify patterns
              </p>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Diet Guide</h3>
              <p className="text-sm text-muted-foreground">
                Step-by-step elimination diet plan to identify food triggers
              </p>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Vet Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Share detailed reports with your veterinarian for better care
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <div className="bg-muted/50 py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AllerPaws. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <button onClick={() => navigate("/about")} className="hover:text-primary">About</button>
            <button onClick={() => navigate("/privacy")} className="hover:text-primary">Privacy</button>
            <button onClick={() => navigate("/terms")} className="hover:text-primary">Terms</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
