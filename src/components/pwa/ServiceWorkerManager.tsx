
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { hasChanges, resetChangesFlag } from '@/lib/sync-utils';

interface ServiceWorkerManagerProps {
  children: React.ReactNode;
}

// Track when global event listeners are registered to prevent duplicates
declare global {
  interface Window {
    __allerpawsEventsRegistered?: boolean;
  }
}

const ServiceWorkerManager: React.FC<ServiceWorkerManagerProps> = ({ children }) => {
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { toast } = useToast();

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
          
          // Set up message event handler only once
          if (!window.__allerpawsEventsRegistered) {
            window.__allerpawsEventsRegistered = true;
            
            navigator.serviceWorker.addEventListener('message', (event) => {
              console.log('Message from service worker:', event.data);
              
              // Handle sync complete messages - but don't show notifications for them
              if (event.data && event.data.type === 'SYNC_COMPLETE') {
                // Map shorter tag names back to their full versions for event dispatching
                let fullTagName = event.data.tag;
                
                // Convert short tag names to the longer versions used in data hooks
                if (event.data.tag === 'pets') fullTagName = 'sync-pets';
                if (event.data.tag === 'symptoms') fullTagName = 'sync-symptoms';
                if (event.data.tag === 'food') fullTagName = 'sync-food';
                if (event.data.tag === 'reminders') fullTagName = 'sync-reminders';
                
                // We'll still dispatch the event so data refreshes can happen
                // But we'll only trigger refresh if there have been user changes
                if (hasChanges()) {
                  window.dispatchEvent(new CustomEvent('data-sync-complete', { 
                    detail: { tag: fullTagName }
                  }));
                  
                  // Reset changes flag after sync is complete
                  resetChangesFlag();
                  
                  // Log the sync for debugging but don't show toast
                  console.log(`Sync complete with user changes: ${fullTagName}`);
                } else {
                  console.log(`Skipping sync notification (no changes): ${fullTagName}`);
                }
              }
            });
          }
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
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
  
  return <>{children}</>;
};

export default ServiceWorkerManager;
