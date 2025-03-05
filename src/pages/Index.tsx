
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Onboarding from "@/components/Onboarding";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setShowOnboarding(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4 py-8">
        {showOnboarding ? (
          <Onboarding />
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">AllerPaws</h1>
            <p className="text-muted-foreground mb-8">Track and manage your pet's food allergies</p>
            
            <div className="space-y-4">
              <Button onClick={handleGetStarted} className="w-full">
                Get Started
              </Button>
              <Button onClick={() => navigate("/auth")} variant="outline" className="w-full">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
