
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { usePets } from "@/hooks/use-pets";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import BottomNavigation from "@/components/BottomNavigation";
import { useUserSubscription } from "@/hooks/use-user-subscription";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, PlusCircle, ArrowRight, Bell, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { forceNextSync } from "@/lib/sync-utils";

// Import refactored components
import DashboardBackground from "@/components/dashboard/DashboardBackground";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import PetTipCard from "@/components/dashboard/PetTipCard";
import PetsSection from "@/components/dashboard/PetsSection";
import SignOutOverlay from "@/components/dashboard/SignOutOverlay";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pets, loading, fetchPets, isOffline } = usePets();
  const { recentActivity, symptomsThisWeek, loading: statsLoading } = useDashboardStats();
  const { hasPremiumAccess } = useUserSubscription();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const userName = user?.user_metadata?.full_name || "Pet Parent";
  const firstName = userName.split(' ')[0];
  const isPremium = hasPremiumAccess;
  const initialFetchDone = useRef(false);

  // Fetch data when dashboard is loaded
  useEffect(() => {
    if (!initialFetchDone.current) {
      console.log("Dashboard mounted - fetching data once");
      initialFetchDone.current = true;
      
      // Force sync for initial load
      forceNextSync();
      
      // Small timeout to prevent overlap with other initialization
      setTimeout(() => {
        fetchPets(true); // Force refresh on initial load
      }, 100);
    }
  }, [fetchPets]);

  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    forceNextSync(); // Mark for sync regardless of changes
    
    try {
      await fetchPets(true);
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      // Add delay to prevent quick re-clicks
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  // If signing out, show a full-screen loading indicator
  if (isSigningOut) {
    return <SignOutOverlay />;
  }

  if (loading || statsLoading) {
    return <DashboardLoading />;
  }

  const handleLogSymptom = () => {
    navigate('/add-symptom');
  };

  const handleLogFood = () => {
    navigate('/add-food-entry');
  };

  return (
    <DashboardBackground>
      <DashboardHeader 
        userName={userName}
        firstName={firstName}
        isPremium={isPremium}
        setIsSigningOut={setIsSigningOut}
        isSigningOut={isSigningOut}
      />
      
      <div className="space-y-5">
        {/* Status indicator for offline mode */}
        {isOffline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-100 text-amber-800 px-3 py-2 rounded-md text-sm flex items-center justify-between mb-2"
          >
            <span>You're currently offline</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 px-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </motion.div>
        )}
        
        <StatsCards 
          recentActivity={recentActivity} 
          symptomsThisWeek={symptomsThisWeek} 
        />
        
        {/* Quick Actions - more mobile friendly with fixed navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <Button 
            onClick={handleLogSymptom}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white h-auto py-3 shadow-md"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> 
            Log Symptom
          </Button>
          <Button 
            onClick={handleLogFood}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white h-auto py-3 shadow-md"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> 
            Log Food
          </Button>
        </motion.div>
        
        <PetsSection pets={pets} />
        
        {/* Reminders Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="bg-white/80 shadow-sm border border-primary/10 hover:shadow-md transition-all">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium flex items-center">
                  <Bell className="h-4 w-4 text-primary mr-2" />
                  Upcoming Reminders
                </h3>
                <Button variant="ghost" size="sm" className="text-primary h-8 px-2" onClick={() => navigate('/reminders')}>
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
        
        {/* Manual refresh button for when user wants to force update */}
        <div className="flex justify-center pt-2 pb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh data'}
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-5"
      >
        <BottomNavigation />
      </motion.div>
    </DashboardBackground>
  );
};

export default Dashboard;
