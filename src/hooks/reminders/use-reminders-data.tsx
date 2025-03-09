import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pet, Reminder } from "@/lib/types";

// Track when the last sync was registered to prevent duplicate registrations
let lastSyncRegistered = 0;
const SYNC_THROTTLE_MS = 60000; // Only register sync once per minute

// Define a simplified Pet type for what we need in this component
interface SimplePet {
  id: string;
  name: string;
}

export const useRemindersData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [pets, setPets] = useState<SimplePet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // Update online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Trigger a refresh when coming back online
      fetchData();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for sync complete events from service worker
  useEffect(() => {
    let syncInProgress = false;
    const handleSyncComplete = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.tag === 'sync-reminders') {
        // Prevent duplicate refreshes for the same sync event
        if (syncInProgress) return;
        
        syncInProgress = true;
        console.log('Reminders data sync completed, refreshing data');
        fetchData().finally(() => {
          // Reset after a delay to prevent rapid successive events
          setTimeout(() => {
            syncInProgress = false;
          }, 1000);
        });
      }
    };

    window.addEventListener('data-sync-complete', handleSyncComplete);

    return () => {
      window.removeEventListener('data-sync-complete', handleSyncComplete);
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;
    
    // Don't fetch again if we're already syncing
    if (isSyncing) {
      console.log('Skipping duplicate reminders fetch - sync already in progress');
      return;
    }

    try {
      setIsSyncing(true);
      setLoading(true);
      
      // If offline, log but still try to fetch (service worker will handle caching)
      if (isOffline) {
        console.log('Fetching reminders while offline (using cache)');
      }
      
      // Add cache busting for PWA context
      const timestamp = new Date().getTime();
      
      // Fetch pets
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("id, name")
        .eq("user_id", user.id)
        .order("name");
        
      if (petsError) throw petsError;
      
      setPets(petsData || []);
      
      // Fetch reminders with pet names
      const { data: remindersData, error: remindersError } = await supabase
        .from("reminders")
        .select(`
          id,
          title,
          description,
          time,
          days,
          pet_id,
          active,
          pets:pet_id (name)
        `)
        .eq("user_id", user.id)
        .order("time");
        
      if (remindersError) throw remindersError;
      
      // Map the database fields to our Reminder type
      const formattedReminders: Reminder[] = remindersData.map(reminder => ({
        id: reminder.id,
        title: reminder.title,
        description: reminder.description,
        time: reminder.time,
        days: reminder.days,
        petId: reminder.pet_id,
        petName: reminder.pets?.name,
        active: reminder.active,
      }));
      
      setReminders(formattedReminders);
      
      console.log(`Fetched ${formattedReminders.length} reminders at ${timestamp}`);
      
      // If we're in a PWA, register for background sync
      const currentTime = Date.now();
      if ('serviceWorker' in navigator && 'SyncManager' in window && 
          navigator.serviceWorker.controller && 
          (currentTime - lastSyncRegistered > SYNC_THROTTLE_MS)) {
        
        navigator.serviceWorker.ready.then(registration => {
          // Check if sync is available on the registration
          if ('sync' in registration) {
            registration.sync.register('sync-reminders').then(() => {
              lastSyncRegistered = currentTime;
              console.log('Background sync for reminders registered at', new Date(currentTime).toISOString());
            }).catch(err => {
              console.error('Failed to register background sync for reminders:', err);
            });
          }
        });
      }
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
      
      // Different message based on connection status
      if (isOffline) {
        toast({
          title: "You're offline",
          description: "Using locally stored reminders",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load reminders",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, [user, toast, isOffline, isSyncing]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  return {
    reminders,
    pets,
    loading,
    fetchData,
    setReminders,
    isOffline
  };
};
