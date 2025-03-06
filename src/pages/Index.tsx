import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeData } from "@/hooks/use-home-data";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, PawPrint, Sparkles } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AnimatedBackground from "@/components/ui/animated-background";
import FeaturedImage from "@/components/ui/featured-image";
import { motion } from "framer-motion";

// Import the components
import HomeHeader from "@/components/home/HomeHeader";
import RecentLogsCard from "@/components/home/RecentLogsCard";
import RemindersCard from "@/components/home/RemindersCard";
import WelcomeScreen from "@/components/home/WelcomeScreen";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [checkingPets, setCheckingPets] = useState(true);
  const { recentLogs, reminders, loading: dataLoading, fetchData } = useHomeData();

  useEffect(() => {
    const checkPets = async () => {
      if (user) {
        try {
          const { data, error, count } = await supabase
            .from("pets")
            .select("id", { count: 'exact' })
            .eq("user_id", user.id)
            .limit(1);
            
          if (error) {
            throw error;
          }
          
          setHasPets(count !== null && count > 0);
        } catch (error) {
          console.error("Error checking pets:", error);
          setHasPets(false);
        } finally {
          setCheckingPets(false);
        }
      } else {
        setCheckingPets(false);
      }
    };
    
    checkPets();
  }, [user]);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setShowOnboarding(true);
    }
  };

  const handleQuickLog = () => {
    navigate("/symptom-diary/new");
  };

  const handleAddPet = () => {
    navigate("/add-pet");
  };

  // If not authenticated, immediately show welcome screen
  if (!user) {
    return <WelcomeScreen showOnboarding={showOnboarding} onGetStarted={handleGetStarted} />;
  }

  // Show minimal loading indicator if data is still loading (auth is confirmed)
  if (dataLoading || checkingPets) {
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
          Loading your pet data...
        </motion.p>
      </div>
    );
  }

  // Show the dashboard for authenticated users
  return (
    <AnimatedBackground 
      variant="paws" 
      density="medium" 
      speed="medium" 
      color="primary"
    >
      <div className="min-h-screen">
        <div className="container relative pb-20 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HomeHeader />
          </motion.div>
          
          {/* Add Pet CTA if user has no pets */}
          {!hasPets && (
            <motion.div 
              className="my-6 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-primary/10 text-center shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FeaturedImage 
                  name="happyDogOwner"
                  height={180}
                  className="mx-auto mb-4"
                  shadow={true}
                  rounded={true}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Welcome to AllerPaws!</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by adding your first pet to track allergies and symptoms
                </p>
                <Button 
                  onClick={handleAddPet}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Pet
                </Button>
              </motion.div>
            </motion.div>
          )}
          
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <RecentLogsCard recentLogs={recentLogs || []} onAddFirstLog={handleQuickLog} />
            </motion.div>
            
            {reminders && reminders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <RemindersCard reminders={reminders} />
              </motion.div>
            )}
            
            {/* Quick tips card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border shadow-sm p-5"
            >
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold">Pet Allergy Tips</h3>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Keep a consistent diet log to identify patterns</p>
                <p>• Take clear photos of any symptoms for your vet</p>
                <p>• Introduce new foods one at a time during elimination diets</p>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <BottomNavigation />
          </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Index;
