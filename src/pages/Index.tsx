import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeData } from "@/hooks/use-home-data";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PatternBackground from "@/components/ui/pattern-background";
import FeaturedImage from "@/components/ui/featured-image";

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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="text-sm text-muted-foreground mt-4">Loading your data...</p>
      </div>
    );
  }

  // Show the dashboard for authenticated users
  return (
    <PatternBackground color="primary" opacity={0.03}>
      <div className="min-h-screen">
        <div className="container relative pb-20 pt-4">
          <HomeHeader />
          
          {/* Add Pet CTA if user has no pets */}
          {!hasPets && (
            <div className="my-6 p-4 bg-primary/5 rounded-lg border border-primary/10 text-center">
              <FeaturedImage 
                name="happyDogOwner"
                height={160}
                className="mx-auto mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">Welcome to AllerPaws!</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Start by adding your first pet to track allergies and symptoms
              </p>
              <Button onClick={handleAddPet}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Pet
              </Button>
            </div>
          )}
          
          <div className="space-y-6">
            <RecentLogsCard recentLogs={recentLogs || []} onAddFirstLog={handleQuickLog} />
            {reminders && reminders.length > 0 && (
              <RemindersCard reminders={reminders} />
            )}
          </div>
          
          <BottomNavigation />
        </div>
      </div>
    </PatternBackground>
  );
};

export default Index;
