
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Onboarding from "@/components/Onboarding";

interface WelcomeScreenProps {
  showOnboarding: boolean;
  onGetStarted: () => void;
}

const WelcomeScreen = ({ showOnboarding, onGetStarted }: WelcomeScreenProps) => {
  const navigate = useNavigate();

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
              <Button onClick={onGetStarted} className="w-full">
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

export default WelcomeScreen;
