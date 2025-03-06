
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Onboarding from "@/components/Onboarding";
import { getTemporaryPetData } from "@/lib/utils";

interface WelcomeScreenProps {
  showOnboarding: boolean;
  onGetStarted: () => void;
}

const WelcomeScreen = ({ showOnboarding, onGetStarted }: WelcomeScreenProps) => {
  const navigate = useNavigate();
  const tempPetData = getTemporaryPetData();

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
              <Button 
                onClick={() => navigate("/auth")} 
                variant="outline" 
                className="w-full"
              >
                Sign In
              </Button>
              
              {tempPetData && (
                <div className="mt-4 p-3 bg-primary/10 rounded-md text-sm">
                  <p className="font-medium">You have unfinished pet setup for {tempPetData.name}</p>
                  <p className="text-muted-foreground">Sign in to continue setup</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
