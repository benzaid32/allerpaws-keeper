
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useRouteError } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { routes, RedirectHandler } from './lib/routes';
import { LoadingSpinner } from './components/ui/loading-spinner';
import { useToast } from './hooks/use-toast';
import InstallBanner from './components/pwa/InstallBanner';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Register service worker for PWA
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          });
          console.log('Service Worker registered with scope:', registration.scope);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  // Request notification permissions early
  useEffect(() => {
    const requestNotificationPermissions = async () => {
      try {
        // For web notifications
        if ('Notification' in window) {
          // Prepare service worker for notifications
          if ('serviceWorker' in navigator) {
            try {
              // Ensure service worker is ready for notifications
              const registration = await navigator.serviceWorker.ready;
              console.log("Service worker ready for notifications");
            } catch (error) {
              console.error("Error preparing service worker for notifications:", error);
            }
          }
        }
      } catch (error) {
        console.error("App: Error requesting notification permissions:", error);
      }
    };
    
    requestNotificationPermissions();
  }, []);

  // Initialize the app and handle service workers
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("App initialized");
        setIsLoading(false);
      } catch (error) {
        console.error('Service worker error:', error);
        setIsLoading(false);
      }
    };

    initializeApp();

    // Add error handling for uncaught errors
    const handleUnhandledError = (event) => {
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
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledError);
    };
  }, [toast]);

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

  return (
    <main className="min-h-screen flex flex-col">
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" storageKey="allerpaws-theme">
          <BrowserRouter>
            <AuthProvider>
              <SubscriptionProvider>
                <RedirectHandler />
                <Toaster />
                <InstallBanner />
                <Routes>
                  {routes.map((route, index) => (
                    <Route 
                      key={route.path || index}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                </Routes>
              </SubscriptionProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </main>
  );
}

export default App;
