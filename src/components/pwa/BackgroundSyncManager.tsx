
import React, { useEffect, useRef } from 'react';

// Track when background sync was registered to prevent duplicate registrations
let backgroundSyncRegistered = false;
const SYNC_REGISTRATION_DELAY = 5000; // Delay initial sync registration

interface BackgroundSyncManagerProps {
  children: React.ReactNode;
}

const BackgroundSyncManager: React.FC<BackgroundSyncManagerProps> = ({ children }) => {
  const syncSetupAttempted = useRef(false);
  
  useEffect(() => {
    if (syncSetupAttempted.current) return;
    syncSetupAttempted.current = true;
    
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
              // Use shorter tag names to avoid InvalidAccessError
              // The error occurs when tag names are too long
              
              // Stagger registrations to avoid overwhelming the system
              setTimeout(() => {
                registration.sync.register('sync-pets').catch(err => {
                  // Log but don't rethrow - this prevents app from breaking
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
              
              setTimeout(() => {
                registration.sync.register('sync-reminders').catch(err => {
                  console.error('Error registering reminders sync:', err);
                });
              }, 3000);
              
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
  }, []);
  
  return <>{children}</>;
};

export default BackgroundSyncManager;
