
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

  // Show the dashboard for authenticated users
  return (
    <div className="container pb-20">
      <HomeHeader />
      <QuickLogButton />
      <RecentLogsCard recentLogs={recentLogs || []} onAddFirstLog={handleQuickLog} />
      <RemindersCard reminders={reminders || []} />
      <BottomNavigation />
    </div>
  );
};

export default Index;
