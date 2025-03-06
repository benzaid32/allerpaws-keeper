
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
    <div className="flex min-h-screen flex-col justify-between bg-background">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <AuthForm initialView={isSignUp ? "sign-up" : "sign-in"} />
        </div>
      </main>
      <AuthFooter />
    </div>
  );
};

export default Auth;
