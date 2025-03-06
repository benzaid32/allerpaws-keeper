
import React, { useEffect } from "react";

const HomeLoadingSpinner = () => {
  useEffect(() => {
    console.log("HomeLoadingSpinner mounted - app is in loading state");
    
    // Log after 5 seconds if still loading
    const timeout = setTimeout(() => {
      console.log("Still loading after 5 seconds - possible issue with data fetching");
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
};

export default HomeLoadingSpinner;
