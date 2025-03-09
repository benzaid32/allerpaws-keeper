import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SymptomEntry } from "@/lib/types";

export const useSymptomDiary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Update online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Trigger a refresh when coming back online
      fetchEntries();
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
    const handleSyncComplete = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.tag === 'sync-symptoms') {
        console.log('Symptom data sync completed, refreshing data');
        fetchEntries();
      }
    };

    window.addEventListener('data-sync-complete', handleSyncComplete);

    return () => {
      window.removeEventListener('data-sync-complete', handleSyncComplete);
    };
  }, []);

  const fetchEntries = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
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
            symptoms:symptom_id (name)
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
          notes: detail.notes
        })) || [],
        notes: entry.notes
      }));
      
      setEntries(formattedEntries);
      
      // If we're in a PWA, register for background sync
      if ('serviceWorker' in navigator && 'SyncManager' in window && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          // Check if sync is available on the registration
          if ('sync' in registration) {
            registration.sync.register('sync-symptoms').catch(err => {
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
    }
  }, [user, toast, isOffline]);

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

      // Update local state by removing the deleted entry
      setEntries(entries.filter(entry => entry.id !== entryId));

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
    if (user) {
      fetchEntries();
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
