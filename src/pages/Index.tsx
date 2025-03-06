
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeData } from "@/hooks/use-home-data";
import BottomNavigation from "@/components/BottomNavigation";

// Import the components
import HomeHeader from "@/components/home/HomeHeader";
import QuickLogButton from "@/components/home/QuickLogButton";
import RecentLogsCard from "@/components/home/RecentLogsCard";
import RemindersCard from "@/components/home/RemindersCard";
import WelcomeScreen from "@/components/home/WelcomeScreen";
import AddPetButton from "@/components/home/AddPetButton";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { recentLogs, reminders, loading: dataLoading, fetchData } = useHomeData();

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

  // If not authenticated, immediately show welcome screen
  if (!user) {
    return <WelcomeScreen showOnboarding={showOnboarding} onGetStarted={handleGetStarted} />;
  }

  // Show minimal loading indicator if data is still loading (auth is confirmed)
  if (dataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading your data...</p>
      </div>
    );
  }

  // Determine if user has pets by checking if recentLogs could have been populated
  const hasPets = recentLogs && recentLogs.length > 0;

  // Show the dashboard for authenticated users with a stylish background
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-blue-950/20">
      <div className="absolute top-0 right-0 w-full h-64 bg-[url('https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80')] bg-no-repeat bg-right-top bg-contain opacity-30 dark:opacity-15"></div>
      <div className="container relative pb-20">
        <HomeHeader />
        
        {!hasPets && <AddPetButton />}
        
        <div className="space-y-6">
          <RecentLogsCard recentLogs={recentLogs || []} onAddFirstLog={handleQuickLog} />
          <RemindersCard reminders={reminders || []} />
        </div>
        <QuickLogButton />
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Index;
