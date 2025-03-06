
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Onboarding from "@/components/Onboarding";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

interface WelcomeScreenProps {
  showOnboarding: boolean;
  onGetStarted: () => void;
}

const WelcomeScreen = ({ showOnboarding, onGetStarted }: WelcomeScreenProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-blue-950/20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80')] bg-no-repeat bg-right bg-contain opacity-20 dark:opacity-10 z-0"></div>
      
      <div className="w-full max-w-md px-4 py-8 relative z-10">
        {showOnboarding ? (
          <Onboarding />
        ) : (
          <div className="text-center">
            <div className="mb-10 animate-fade-in">
              <div className="inline-block p-2 bg-primary rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"></path>
                  <path d="M14.5 5.173c0-1.39 1.577-2.493 3.5-2.173 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"></path>
                  <path d="M8 14v.5"></path>
                  <path d="M16 14v.5"></path>
                  <path d="M11.25 16.25h1.5L12 17l-.75-.75z"></path>
                  <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"></path>
                </svg>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">{APP_NAME}</h1>
              <p className="text-muted-foreground mb-8">{APP_DESCRIPTION}</p>
            </div>
            
            <div className="space-y-4 bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border/50 animate-slide-up">
              <Button onClick={onGetStarted} className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300">
                Sign Up
              </Button>
              <Button 
                onClick={() => navigate("/auth")} 
                variant="outline" 
                className="w-full"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/pricing")}
                variant="ghost"
                className="w-full"
              >
                View Pricing
              </Button>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Track, manage and prevent pet food allergies</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
