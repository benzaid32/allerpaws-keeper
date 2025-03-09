
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

// Track when the last sync was registered to prevent duplicate registrations
let backgroundSyncRegistered = false;
const SYNC_REGISTRATION_DELAY = 5000; // Delay initial sync registration

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { toast } = useToast();

  // Register service worker for PWA with enhanced error handling and update detection
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          });
          
          console.log('Service Worker registered with scope:', registration.scope);
          
          // Check if there's an updated service worker waiting
          if (registration.waiting) {
            setWaitingServiceWorker(registration.waiting);
            setUpdateAvailable(true);
          }
          
          // Handle new service workers that come in after registration
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingServiceWorker(newWorker);
                setUpdateAvailable(true);
                
                // Notify user of update
                toast({
                  title: "Update Available",
                  description: "A new version is available. Refresh to update.",
                  action: <button onClick={updateServiceWorker} className="bg-primary text-white px-3 py-1 rounded">Update</button>,
                  duration: 0 // Don't auto-dismiss
                });
              }
            });
          });
          
          // Set up message event handler
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('Message from service worker:', event.data);
            
            // Handle sync complete messages
            if (event.data && event.data.type === 'SYNC_COMPLETE') {
              toast({
                title: "Sync Complete",
                description: `${event.data.tag.replace('sync-', '').toUpperCase()} data has been synchronized`,
                duration: 3000
              });
              
              // Trigger a refresh of relevant data
              window.dispatchEvent(new CustomEvent('data-sync-complete', { 
                detail: { tag: event.data.tag }
              }));
            }
          });
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
    
    // Set up periodic background sync (if supported)
    const setupBackgroundSync = async () => {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          
          // Check if sync is available on the registration
          if ('sync' in registration) {
            // Register sync for different data types
            await registration.sync.register('sync-pets');
            await registration.sync.register('sync-symptoms');
            await registration.sync.register('sync-food');
            
            console.log('Background sync registered successfully');
          } else {
            console.log('Background sync API not available on this browser');
          }
        } catch (error) {
          console.error('Error setting up background sync:', error);
        }
      } else {
        console.log('Background sync not supported by browser');
      }
    };
    
    setupBackgroundSync();
  }, [toast]);
  
  // Function to update service worker
  const updateServiceWorker = () => {
    if (!waitingServiceWorker) return;
    
    // Send skip waiting message to service worker
    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    
    // The service worker will activate and control the page
    // We need to reload to ensure the new version is used
    setUpdateAvailable(false);
    window.location.reload();
  };

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

  // Setup background sync with throttling
  useEffect(() => {
    const setupBackgroundSync = async () => {
      if ('serviceWorker' in navigator && 'SyncManager' in window && !backgroundSyncRegistered) {
        try {
          // Delay registration to prevent immediate syncing when app starts
          setTimeout(async () => {
            const registration = await navigator.serviceWorker.ready;
            
            // Check if sync is available on the registration
            if ('sync' in registration) {
              // Register sync for different data types
              await registration.sync.register('sync-pets');
              await registration.sync.register('sync-symptoms');
              await registration.sync.register('sync-food');
              
              backgroundSyncRegistered = true;
              console.log('Background sync registered successfully with delay');
            } else {
              console.log('Background sync API not available on this browser');
            }
          }, SYNC_REGISTRATION_DELAY);
        } catch (error) {
          console.error('Error setting up background sync:', error);
        }
      } else {
        console.log('Background sync not supported by browser or already registered');
      }
    };
    
    // Only set up background sync if the app is fully loaded
    if (!isLoading) {
      setupBackgroundSync();
    }
  }, [isLoading]);

  // Initialize the app with cache-clearing for PWA data
  useEffect(() => {
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
        }, 300);
      } catch (error) {
        console.error('Service worker error:', error);
        setIsLoading(false);
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
      window.removeEventListener('beforeunload', handleBeforeUnload);
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
