
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { usePets } from "@/hooks/use-pets";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import BottomNavigation from "@/components/BottomNavigation";
import { useUserSubscription } from "@/hooks/use-user-subscription";

// Import refactored components
import DashboardBackground from "@/components/dashboard/DashboardBackground";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import PetTipCard from "@/components/dashboard/PetTipCard";
import PetsSection from "@/components/dashboard/PetsSection";
import SignOutOverlay from "@/components/dashboard/SignOutOverlay";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const Dashboard = () => {
  const { user } = useAuth();
  const { pets, loading, fetchPets } = usePets();
  const { recentActivity, symptomsThisWeek, loading: statsLoading } = useDashboardStats();
  const { hasPremiumAccess } = useUserSubscription();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const userName = user?.user_metadata?.full_name || "Pet Parent";
  const firstName = userName.split(' ')[0];
  const isPremium = hasPremiumAccess;

  // Force fetch fresh data when the dashboard is loaded or focused
  useEffect(() => {
    console.log("Dashboard mounted or dependencies changed - fetching fresh data");
    
    // Fetch data immediately when component mounts
    fetchPets();
    
    // Add a timer to refresh data after images might have been processed
    const initialLoadTimer = setTimeout(() => {
      console.log("Dashboard initial delayed refresh");
      fetchPets();
    }, 2000);
    
    // Set up a second refresh for cases where the first one might miss an update
    const secondLoadTimer = setTimeout(() => {
      console.log("Dashboard second delayed refresh");
      fetchPets();
    }, 5000);
    
    return () => {
      clearTimeout(initialLoadTimer);
      clearTimeout(secondLoadTimer);
    };
  }, [fetchPets]);

  // If signing out, show a full-screen loading indicator
  if (isSigningOut) {
    return <SignOutOverlay />;
  }

  if (loading || statsLoading) {
    return <DashboardLoading />;
  }

  return (
    <DashboardBackground>
      <DashboardHeader 
        userName={userName}
        firstName={firstName}
        isPremium={isPremium}
        setIsSigningOut={setIsSigningOut}
        isSigningOut={isSigningOut}
      />
      
      <StatsCards 
        recentActivity={recentActivity} 
        symptomsThisWeek={symptomsThisWeek} 
      />
      
      <PetTipCard />
      
      <PetsSection pets={pets} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <BottomNavigation />
      </motion.div>
    </DashboardBackground>
  );
};

export default Dashboard;
