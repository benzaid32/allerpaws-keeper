
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Log authentication status for debugging
    console.log("ProtectedRoute: user", user?.id, "isLoading", isLoading);
  }, [user, isLoading]);
  
  // Show a compact loading state to minimize layout shifts
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Immediately redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Render the protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
