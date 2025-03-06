
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeData } from "@/hooks/use-home-data";
import BottomNavigation from "@/components/BottomNavigation";

// Import the new components
import HomeHeader from "@/components/home/HomeHeader";
import QuickLogButton from "@/components/home/QuickLogButton";
import RecentLogsCard from "@/components/home/RecentLogsCard";
import RemindersCard from "@/components/home/RemindersCard";
import HomeLoadingSpinner from "@/components/home/HomeLoadingSpinner";
import WelcomeScreen from "@/components/home/WelcomeScreen";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { recentLogs, reminders, loading } = useHomeData();

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

  if (isLoading || loading) {
    return <HomeLoadingSpinner />;
  }

  if (!user) {
    return <WelcomeScreen showOnboarding={showOnboarding} onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="container pb-20">
      <HomeHeader />
      <QuickLogButton />
      <RecentLogsCard recentLogs={recentLogs} onAddFirstLog={handleQuickLog} />
      <RemindersCard reminders={reminders} />
      <BottomNavigation />
    </div>
  );
};

export default Index;
