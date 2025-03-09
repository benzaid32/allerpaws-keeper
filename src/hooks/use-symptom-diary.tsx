
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SymptomEntry } from "@/lib/types";
import { 
  markUserChanges, 
  hasChanges, 
  resetChangesFlag, 
  isInitialLoadCompleted,
  markInitialLoadCompleted 
} from "@/lib/sync-utils";

// Track when the last sync was registered to prevent duplicate registrations
let lastSyncRegistered = 0;
const SYNC_THROTTLE_MS = 60000; // Only register sync once per minute

export const useSymptomDiary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const initialLoadDone = useRef(false);
  const syncListenerAdded = useRef(false);

  // Update online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Trigger a refresh when coming back online
      fetchEntries(true);
      toast({
        title: "You're back online",
        description: "Syncing your symptom diary",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "You're offline",
        description: "Using cached symptom data",
        variant: "default",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Listen for sync complete events from service worker
  useEffect(() => {
    if (syncListenerAdded.current) return;
    
    syncListenerAdded.current = true;
    let syncInProgress = false;
    let syncTimeout: number | null = null;
    
    const handleSyncComplete = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.tag === 'sync-symptoms' || 
          customEvent.detail?.dataType === 'symptoms') {
        // Prevent duplicate refreshes for the same sync event
        if (syncInProgress) return;
        
        syncInProgress = true;
        console.log('Symptom data sync completed, refreshing data');
        
        // Clear any existing timeout
        if (syncTimeout) {
          window.clearTimeout(syncTimeout);
        }
        
        // Create new timeout for debouncing
        syncTimeout = window.setTimeout(() => {
          fetchEntries(true).finally(() => {
            // Reset after a delay to prevent rapid successive events
            setTimeout(() => {
              syncInProgress = false;
              syncTimeout = null;
            }, 1000);
          });
        }, 300); // Debounce for 300ms
      }
    };

    window.addEventListener('data-sync-complete', handleSyncComplete);
    
    // Also listen for storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'symptoms_updated' || e.key === null) {
        console.log('Storage change detected that affects symptoms, refreshing');
        if (!syncInProgress) {
          syncInProgress = true;
          setTimeout(() => {
            fetchEntries(true).finally(() => {
              syncInProgress = false;
            });
          }, 300);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('data-sync-complete', handleSyncComplete);
      window.removeEventListener('storage', handleStorageChange);
      if (syncTimeout) {
        window.clearTimeout(syncTimeout);
      }
    };
  }, []);

  const fetchEntries = useCallback(async (forceRefresh = false) => {
    if (!user) return;
    
    // Don't fetch again if we're already syncing
    if (isSyncing) {
      console.log('Skipping duplicate symptom fetch - sync already in progress');
      return;
    }

    // IMPORTANT: Changed this condition to always fetch on initial load
    // Only skip sync if all these conditions are met:
    // 1. Not a forced refresh
    // 2. No user changes detected
    // 3. Already completed initial load
    // 4. Not offline
    const hasSymptomChanges = hasChanges('symptoms');
    const initialLoadCompleted = isInitialLoadCompleted();
    
    console.log(`Symptoms fetch check - Force: ${forceRefresh}, Changes: ${hasSymptomChanges}, Initial load: ${initialLoadCompleted}, Offline: ${isOffline}`);
    
    if (!forceRefresh && !hasSymptomChanges && initialLoadCompleted && !isOffline) {
      console.log('Skipping symptom fetch - no user changes detected and initial load completed');
      return;
    }

    try {
      setIsSyncing(true);
      setLoading(true);
      
      console.log('Fetching symptom entries...');
      
      // If offline, show debug message but still try to fetch (from cache via service worker)
      if (isOffline) {
        console.log('Attempting to fetch symptom entries while offline (from cache)');
      }
      
      // Fetch symptom entries with pet names and symptom details
      // Add cache control headers for PWA context
      const fetchOptions: any = {};
      if (window.matchMedia('(display-mode: standalone)').matches) {
        fetchOptions.headers = {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        };
      }
      
      const { data: entriesData, error: entriesError } = await supabase
        .from("symptom_entries")
        .select(`
          id,
          pet_id,
          date,
          notes,
          pets:pet_id (name),
          symptom_details:symptom_details (
            id,
            symptom_id,
            severity,
            notes,
            symptoms:symptom_id (name, is_custom)
          )
        `)
        .eq("pets.user_id", user.id)
        .order("date", { ascending: false });
        
      if (entriesError) throw entriesError;
      
      // Transform the data to match our SymptomEntry type
      const formattedEntries: SymptomEntry[] = entriesData.map(entry => ({
        id: entry.id,
        petId: entry.pet_id,
        petName: entry.pets?.name || "Unknown Pet",
        date: new Date(entry.date).toISOString().split('T')[0],
        time: new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        symptoms: entry.symptom_details?.map(detail => ({
          symptomId: detail.symptom_id,
          name: detail.symptoms?.name,
          severity: detail.severity as "mild" | "moderate" | "severe",
          notes: detail.notes,
          isCustom: detail.symptoms?.is_custom
        })) || [],
        notes: entry.notes
      }));
      
      setEntries(formattedEntries);
      console.log(`Loaded ${formattedEntries.length} symptom entries`);

      // After successful fetch, reset the changes flag and mark initial load as complete
      resetChangesFlag('symptoms');
      markInitialLoadCompleted();
      
      // Notify other browser tabs about the update
      try {
        const timestamp = new Date().getTime();
        localStorage.setItem('symptoms_updated', timestamp.toString());
      } catch (e) {
        console.warn('Could not update localStorage for cross-tab notification', e);
      }
      
      // Register for background sync, but throttle it to prevent infinite loops
      const currentTime = Date.now();
      if ('serviceWorker' in navigator && 'SyncManager' in window && 
          navigator.serviceWorker.controller && 
          (currentTime - lastSyncRegistered > SYNC_THROTTLE_MS)) {
        
        navigator.serviceWorker.ready.then(registration => {
          // Check if sync is available on the registration
          if ('sync' in registration) {
            registration.sync.register('sync-symptoms').then(() => {
              lastSyncRegistered = currentTime;
              console.log('Background sync for symptoms registered at', new Date(currentTime).toISOString());
            }).catch(err => {
              console.error('Failed to register background sync for symptoms:', err);
            });
          }
        });
      }
    } catch (error: any) {
      console.error("Error fetching symptom entries:", error.message);
      
      // Show different message based on online status
      if (isOffline) {
        toast({
          title: "You're offline",
          description: "Using locally cached symptom data",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load symptom diary entries",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, [user, toast, isOffline, isSyncing]);

  // Function to delete a symptom entry
  const deleteEntry = async (entryId: string) => {
    if (!user) return;

    try {
      // First delete related symptom details
      const { error: detailsError } = await supabase
        .from("symptom_details")
        .delete()
        .eq("entry_id", entryId);

      if (detailsError) throw detailsError;

      // Then delete the entry itself
      const { error: entryError } = await supabase
        .from("symptom_entries")
        .delete()
        .eq("id", entryId);

      if (entryError) throw entryError;

      // Mark that user has made changes
      markUserChanges('symptoms');
      
      // Update local state by removing the deleted entry
      setEntries(entries.filter(entry => entry.id !== entryId));
      
      // Force a data refresh to ensure UI is up-to-date
      await fetchEntries(true);
      
      // Emit a custom event to notify that data has changed
      window.dispatchEvent(new CustomEvent('data-sync-complete', { 
        detail: { dataType: 'symptoms', tag: 'sync-symptoms' } 
      }));

      toast({
        title: "Success",
        description: "Symptom entry deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting symptom entry:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete symptom entry",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user && !initialLoadDone.current) {
      initialLoadDone.current = true;
      // Small delay to prevent overlap with other loading processes
      setTimeout(() => {
        fetchEntries(true); // Force refresh on initial load
      }, 150);
    }
  }, [user, fetchEntries]);

  return {
    entries,
    loading,
    fetchEntries,
    deleteEntry,
    isOffline
  };
};
