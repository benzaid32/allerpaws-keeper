
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AppInitializerProps {
  children: React.ReactNode;
  onInitialized: () => void;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children, onInitialized }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const initDone = useRef(false);

  // Initialize the app with cache-clearing for PWA data
  useEffect(() => {
    if (initDone.current) return;
    
    initDone.current = true;
    const initializeApp = async () => {
      try {
        console.log("App initialized");
        
        // For PWAs, clear data caches on startup
        if (window.matchMedia('(display-mode: standalone)').matches) {
          if ('caches' in window) {
            try {
              // Only clear the dynamic data cache, not static assets
              await caches.delete('allerpaws-dynamic-v1');
              await caches.delete('allerpaws-api-v1');
              console.log('Cleared dynamic data caches on PWA startup');
            } catch (error) {
              console.error('Error clearing caches:', error);
            }
          }
        }
        
        // Add a small delay to ensure all components are properly loaded
        // This helps with refresh issues on dashboard pages
        setTimeout(() => {
          setIsLoading(false);
          onInitialized();
        }, 300);
      } catch (error) {
        console.error('Service worker error:', error);
        setIsLoading(false);
        onInitialized();
      }
    };

    initializeApp();

    // Handle browser refresh for route preservation
    const handleBeforeUnload = () => {
      const currentPath = window.location.pathname;
      // Store current route in localStorage if it's a route that needs preservation
      if (currentPath !== '/' && !currentPath.includes('.')) {
        localStorage.setItem('redirectAfterLoad', currentPath);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Add error handling for uncaught errors
    const handleUnhandledError = (event: any) => {
      console.error('Unhandled error:', event.error || event.message);
      toast({
        title: "Something went wrong",
        description: "The application encountered an error. Please refresh the page.",
        variant: "destructive",
      });
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledError);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledError);
    };
  }, [toast, onInitialized]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner className="h-12 w-12" />
          <p className="text-lg font-medium">Starting Aller Paws...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;
