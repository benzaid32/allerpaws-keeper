
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeData } from "@/hooks/use-home-data";
import BottomNavigation from "@/components/BottomNavigation";

// Import the components
import HomeHeader from "@/components/home/HomeHeader";
import QuickLogButton from "@/components/home/QuickLogButton";
import RecentLogsCard from "@/components/home/RecentLogsCard";
import RemindersCard from "@/components/home/RemindersCard";
import HomeLoadingSpinner from "@/components/home/HomeLoadingSpinner";
import WelcomeScreen from "@/components/home/WelcomeScreen";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { recentLogs, reminders, loading: dataLoading, fetchData } = useHomeData();
  const { toast } = useToast();
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  // Add a loading timeout to prevent infinite loading
  useEffect(() => {
    console.log("Index component mounted");
    console.log("Auth loading:", authLoading);
    console.log("Data loading:", dataLoading);
    
    const timeoutId = setTimeout(() => {
      if (authLoading || dataLoading) {
        console.log("Loading timed out after 10 seconds");
        setLoadingTimedOut(true);
        
        toast({
          title: "Taking longer than expected",
          description: "Try refreshing the page if content doesn't appear",
          variant: "destructive",
        });
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [authLoading, dataLoading]);

  // Retry fetching data if there's a timeout
  useEffect(() => {
    if (loadingTimedOut && user) {
      console.log("Attempting to refetch data after timeout");
      fetchData();
    }
  }, [loadingTimedOut, user]);

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

  // Show loading spinner with timeout
  if ((authLoading || dataLoading) && !loadingTimedOut) {
    return <HomeLoadingSpinner />;
  }

  // If we've timed out but have a user, show content anyway
  if (loadingTimedOut && user) {
    console.log("Rendering content despite timeout");
  }

  if (!user) {
    return <WelcomeScreen showOnboarding={showOnboarding} onGetStarted={handleGetStarted} />;
  }

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
