
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Not Found page accessed for path:", location.pathname);
    
    // If this is a direct browser refresh, try to recover by checking if the path
    // should be valid in our app (doesn't have an extension)
    if (!location.pathname.includes('.')) {
      console.log("This might be a valid app route, going to set redirectAfterLoad");
      // Store current path for potential redirect after app initialization
      localStorage.setItem('redirectAfterLoad', location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <img 
          src="/icons/icon-192x192.png" 
          alt="AllerPaws Logo" 
          className="w-24 h-24 mx-auto mb-4"
        />
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">
          The page "{location.pathname}" you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/")} className="inline-flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
