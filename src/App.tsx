import React, { useEffect, useState, useRef } from 'react';
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

// Add type declarations for window object
declare global {
  interface Window {
    __allerpawsEventsRegistered?: boolean;
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { toast } = useToast();
  const serviceWorkerRegistered = useRef(false);
  const initDone = useRef(false);

  // Register service worker for PWA with enhanced error handling and update detection
  useEffect(() => {
    if (serviceWorkerRegistered.current) return;
    
    serviceWorkerRegistered.current = true;
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
          
          // Set up message event handler only once
          if (!window.__allerpawsEventsRegistered) {
            window.__allerpawsEventsRegistered = true;
            
            navigator.serviceWorker.addEventListener('message', (event) => {
              console.log('Message from service worker:', event.data);
              
              // Handle sync complete messages - but don't show notifications for them
              if (event.data && event.data.type === 'SYNC_COMPLETE') {
                // We'll still dispatch the event so data refreshes can happen
                // But we won't show the toast notification
                window.dispatchEvent(new CustomEvent('data-sync-complete', { 
                  detail: { tag: event.data.tag }
                }));
                
                // Log the sync for debugging but don't show toast
                console.log(`Sync complete: ${event.data.tag}`);
              }
            });
          }
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
    
    // Set up background sync with careful throttling
    const setupBackgroundSync = async () => {
      // Only perform this once and only if supported
      if (backgroundSyncRegistered || !('serviceWorker' in navigator) || !('SyncManager' in window)) {
        return;
      }
      
      try {
        // Wait for service worker to be ready before registering sync
        setTimeout(async () => {
          try {
            const registration = await navigator.serviceWorker.ready;
            
            // Check if sync is available on the registration
            if ('sync' in registration) {
              // Stagger registrations to avoid overwhelming the system
              setTimeout(() => {
                registration.sync.register('sync-pets').catch(err => {
                  console.error('Error registering pets sync:', err);
                });
              }, 0);
              
              setTimeout(() => {
                registration.sync.register('sync-symptoms').catch(err => {
                  console.error('Error registering symptoms sync:', err);
                });
              }, 1000);
              
              setTimeout(() => {
                registration.sync.register('sync-food').catch(err => {
                  console.error('Error registering food sync:', err);
                });
              }, 2000);
              
              backgroundSyncRegistered = true;
              console.log('Background syncs registered with staggered timing');
            } else {
              console.log('Background sync API not available on this browser');
            }
          } catch (error) {
            console.error('Error in delayed sync setup:', error);
          }
        }, SYNC_REGISTRATION_DELAY);
      } catch (error) {
        console.error('Error setting up background sync:', error);
      }
    };
    
    // Call setupBackgroundSync after a delay
    setTimeout(() => {
      setupBackgroundSync();
    }, 2000);
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
              await navigator.serviceWorker.ready;
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
