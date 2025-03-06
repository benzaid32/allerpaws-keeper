
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooter from "@/components/auth/AuthFooter";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Auth = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Check if signup parameter is in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const signup = searchParams.get("signup");
    if (signup === "true") {
      setIsSignUp(true);
    }
  }, [location]);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner className="h-12 w-12" />
          <p className="text-lg font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-gradient-to-b from-background to-background/95 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -z-10"></div>
      
      <AuthHeader />
      
      <main className="flex-1 flex items-center justify-center p-4 relative">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {isSignUp 
              ? "Join AllerPaws and start managing your pet's allergies today."
              : "Sign in to access your AllerPaws dashboard."}
          </p>
          <div className="transform hover:scale-[1.01] transition-all duration-300">
            <AuthForm initialView={isSignUp ? "sign-up" : "sign-in"} />
          </div>
        </div>
      </main>
      
      <AuthFooter />
    </div>
  );
};

export default Auth;
