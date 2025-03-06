
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, savePetData } = useAuth();
  const location = useLocation();
  
  // Check if there's temporary pet data stored and try to save it
  useEffect(() => {
    if (user && savePetData) {
      const tempPetData = localStorage.getItem('temporaryPetData');
      if (tempPetData) {
        try {
          console.log("Protected route: Found temporary pet data to process");
          const petData = JSON.parse(tempPetData);
          savePetData(petData)
            .then(success => {
              if (success) {
                console.log("Protected route: Successfully saved pet data");
                localStorage.removeItem('temporaryPetData');
              }
            })
            .catch(error => {
              console.error("Protected route: Error saving pet data:", error);
            });
        } catch (error) {
          console.error("Protected route: Error parsing pet data:", error);
          localStorage.removeItem('temporaryPetData');
        }
      }
    }
  }, [user, savePetData]);
  
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
