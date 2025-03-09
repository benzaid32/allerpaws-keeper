
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ensurePatterns } from '@/utils/upload-patterns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AppInitializerProps {
  children: React.ReactNode;
  onInitialized: () => void;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ 
  children, 
  onInitialized 
}) => {
  const { isLoading: authLoading } = useAuth();
  const [patternsInitialized, setPatternsInitialized] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  // Initialize patterns
  useEffect(() => {
    const initPatterns = async () => {
      try {
        await ensurePatterns();
        setPatternsInitialized(true);
      } catch (error) {
        console.error("Error initializing patterns:", error);
        // Even if there's an error, we mark as initialized to not block the app
        setPatternsInitialized(true);
      }
    };

    initPatterns();
  }, []);

  // Check if all initializations are complete
  useEffect(() => {
    if (!authLoading && patternsInitialized && !initializationComplete) {
      setInitializationComplete(true);
      onInitialized();
    }
  }, [authLoading, patternsInitialized, initializationComplete, onInitialized]);

  if (authLoading || !patternsInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Initializing application...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;
