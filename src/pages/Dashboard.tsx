
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { usePets } from "@/hooks/use-pets";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import BottomNavigation from "@/components/BottomNavigation";
import { useUserSubscription } from "@/hooks/use-user-subscription";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, PlusCircle, ArrowRight, Bell } from "lucide-react";

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

  // Fetch data only once when the dashboard is loaded 
  useEffect(() => {
    console.log("Dashboard mounted - fetching data once");
    fetchPets();
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
      
      {/* Welcome banner with improved mobile styling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-primary/90 to-primary/70 border-none shadow-lg text-white p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="mb-2 sm:mb-0">
              <h2 className="text-xl font-bold mb-1">Welcome back, {firstName}!</h2>
              <p className="text-white/90 text-sm">Track your pet's health journey with AllerPaws</p>
            </div>
            {isPremium && (
              <Badge className="bg-yellow-400/90 text-primary-foreground flex items-center gap-1 px-3 py-1 self-start sm:self-auto">
                <Sparkles className="h-3 w-3" />
                PREMIUM
              </Badge>
            )}
          </div>
        </Card>
      </motion.div>
      
      <StatsCards 
        recentActivity={recentActivity} 
        symptomsThisWeek={symptomsThisWeek} 
      />
      
      {/* Quick Actions - more mobile friendly */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        <Button 
          onClick={() => window.location.href = '/add-symptom'}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white h-auto py-3 shadow-md"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> 
          Log Symptom
        </Button>
        <Button 
          onClick={() => window.location.href = '/add-food-entry'}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white h-auto py-3 shadow-md"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> 
          Log Food
        </Button>
      </motion.div>
      
      <PetTipCard />
      
      <PetsSection pets={pets} />
      
      {/* Reminders Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mb-8"
      >
        <Card className="bg-white/80 shadow-sm border border-primary/10 hover:shadow-md transition-all">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium flex items-center">
                <Bell className="h-4 w-4 text-primary mr-2" />
                Upcoming Reminders
              </h3>
              <Button variant="ghost" size="sm" className="text-primary h-8 px-2" onClick={() => window.location.href = '/reminders'}>
                View All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="text-center py-3 text-muted-foreground text-sm">
              No upcoming reminders
            </div>
          </div>
        </Card>
      </motion.div>

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
