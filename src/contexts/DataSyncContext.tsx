
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getSyncSettings, updateSyncSettings, recordSync } from "@/lib/local-storage-utils";
import { setSyncToServer, getSyncToServer } from "@/lib/sync-utils";

type SyncFrequency = 'weekly' | 'monthly' | 'manual' | 'never';

interface DataSyncContextType {
  isOnlineOnly: boolean;
  toggleOnlineMode: () => void;
  syncFrequency: SyncFrequency;
  setSyncFrequency: (frequency: SyncFrequency) => void;
  lastSyncTime: Date | null;
  syncNow: () => Promise<boolean>;
  isSyncing: boolean;
}

const DataSyncContext = createContext<DataSyncContextType | undefined>(undefined);

export const useDataSync = () => {
  const context = useContext(DataSyncContext);
  if (context === undefined) {
    throw new Error('useDataSync must be used within a DataSyncProvider');
  }
  return context;
};

interface DataSyncProviderProps {
  children: ReactNode;
}

export const DataSyncProvider: React.FC<DataSyncProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOnlineOnly, setIsOnlineOnly] = useState<boolean>(() => getSyncToServer());
  const [syncFrequency, setSyncFrequency] = useState<SyncFrequency>(() => getSyncSettings().frequency);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(() => {
    const lastSync = getSyncSettings().lastSync;
    return lastSync ? new Date(lastSync) : null;
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const settings = getSyncSettings();
    setSyncFrequency(settings.frequency);
    setLastSyncTime(settings.lastSync ? new Date(settings.lastSync) : null);
    setIsOnlineOnly(getSyncToServer());
  }, []);

  const toggleOnlineMode = () => {
    const newValue = !isOnlineOnly;
    setIsOnlineOnly(newValue);
    setSyncToServer(newValue);
    
    toast({
      title: newValue ? "Online Mode Enabled" : "Offline Mode Enabled",
      description: newValue 
        ? "Your data will be synced to the cloud" 
        : "Your data will be stored locally only",
    });
  };

  const updateFrequency = (frequency: SyncFrequency) => {
    setSyncFrequency(frequency);
    updateSyncSettings(frequency);
    
    toast({
      title: "Sync Frequency Updated",
      description: frequency === 'never' 
        ? "Automatic sync has been disabled" 
        : frequency === 'manual'
        ? "Sync will only happen when you manually trigger it"
        : `Your data will sync ${frequency}`,
    });
  };

  // Function to manually trigger sync
  const syncNow = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Sync Failed",
        description: "You need to be logged in to sync data",
        variant: "destructive",
      });
      return false;
    }
    
    setIsSyncing(true);
    
    try {
      // This would trigger the actual sync process
      // For now, we're just simulating the sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Record the sync time
      recordSync();
      const now = new Date();
      setLastSyncTime(now);
      
      toast({
        title: "Sync Complete",
        description: `All data synced at ${now.toLocaleTimeString()}`,
      });
      
      return true;
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Sync Failed",
        description: "There was an error syncing your data",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <DataSyncContext.Provider
      value={{
        isOnlineOnly,
        toggleOnlineMode,
        syncFrequency,
        setSyncFrequency: updateFrequency,
        lastSyncTime,
        syncNow,
        isSyncing
      }}
    >
      {children}
    </DataSyncContext.Provider>
  );
};
