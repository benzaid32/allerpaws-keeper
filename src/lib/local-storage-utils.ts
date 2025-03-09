import { Pet, Symptom, SymptomEntry, Reminder, FoodEntry } from "@/lib/types";

// Define types for the data we'll store
interface LocalStorageData {
  pets: Pet[];
  symptoms: Symptom[];
  symptomEntries: SymptomEntry[];
  reminders: Reminder[];
  foodEntries: FoodEntry[];
  lastSyncTime: number | null;
  syncFrequency: 'daily' | 'weekly' | 'monthly' | 'manual' | 'never';
}

// Initialize default local storage structure
const initializeLocalStorage = (): void => {
  const defaultData: LocalStorageData = {
    pets: [],
    symptoms: [],
    symptomEntries: [],
    reminders: [],
    foodEntries: [],
    lastSyncTime: null,
    syncFrequency: 'manual' // Default to manual sync
  };

  // Only initialize if not already set
  Object.keys(defaultData).forEach(key => {
    if (localStorage.getItem(`allerpaws_${key}`) === null) {
      localStorage.setItem(`allerpaws_${key}`, JSON.stringify(defaultData[key as keyof LocalStorageData]));
    }
  });

  console.log('Local storage initialized for offline-first operation');
};

// Generic function to save data to local storage
const saveToLocalStorage = <T>(key: keyof LocalStorageData, data: T): void => {
  try {
    localStorage.setItem(`allerpaws_${key}`, JSON.stringify(data));
    // Dispatch event to notify other components of the change
    window.dispatchEvent(new CustomEvent(`${key}-data-changed`, { detail: { source: 'local-storage', data } }));
    console.log(`Data saved to local storage: ${key}`);
  } catch (error) {
    console.error(`Error saving ${key} to local storage:`, error);
  }
};

// Generic function to get data from local storage
const getFromLocalStorage = <T>(key: keyof LocalStorageData): T | null => {
  try {
    const data = localStorage.getItem(`allerpaws_${key}`);
    return data ? JSON.parse(data) as T : null;
  } catch (error) {
    console.error(`Error getting ${key} from local storage:`, error);
    return null;
  }
};

// Clear specific data from local storage
const clearFromLocalStorage = (key: keyof LocalStorageData): void => {
  try {
    localStorage.removeItem(`allerpaws_${key}`);
    console.log(`Cleared ${key} from local storage`);
  } catch (error) {
    console.error(`Error clearing ${key} from local storage:`, error);
  }
};

// Update sync settings - Updated to include 'daily' in the type
const updateSyncSettings = (frequency: 'daily' | 'weekly' | 'monthly' | 'manual' | 'never'): void => {
  try {
    localStorage.setItem('allerpaws_syncFrequency', frequency);
    console.log(`Sync frequency updated to: ${frequency}`);
  } catch (error) {
    console.error('Error updating sync frequency:', error);
  }
};

// Get sync settings - Updated return type to include 'daily'
const getSyncSettings = (): { lastSync: number | null; frequency: 'daily' | 'weekly' | 'monthly' | 'manual' | 'never' } => {
  try {
    const lastSync = localStorage.getItem('allerpaws_lastSyncTime');
    const frequency = localStorage.getItem('allerpaws_syncFrequency') || 'manual';
    
    return {
      lastSync: lastSync ? parseInt(lastSync, 10) : null,
      frequency: frequency as 'daily' | 'weekly' | 'monthly' | 'manual' | 'never'
    };
  } catch (error) {
    console.error('Error getting sync settings:', error);
    return { lastSync: null, frequency: 'manual' };
  }
};

// Record last sync time
const recordSync = (): void => {
  try {
    const now = Date.now();
    localStorage.setItem('allerpaws_lastSyncTime', now.toString());
    console.log(`Sync time recorded: ${new Date(now).toLocaleString()}`);
  } catch (error) {
    console.error('Error recording sync time:', error);
  }
};

// Check if sync is due based on frequency
const isSyncDue = (): boolean => {
  const { lastSync, frequency } = getSyncSettings();
  
  if (frequency === 'never') return false;
  if (frequency === 'manual') return false;
  if (!lastSync) return true;
  
  const now = Date.now();
  const elapsed = now - lastSync;
  
  // Check based on frequency
  if (frequency === 'daily') {
    return elapsed > 24 * 60 * 60 * 1000; // 1 day
  } else if (frequency === 'weekly') {
    return elapsed > 7 * 24 * 60 * 60 * 1000; // 7 days
  } else if (frequency === 'monthly') {
    return elapsed > 30 * 24 * 60 * 60 * 1000; // ~30 days
  }
  
  return false;
};

export {
  initializeLocalStorage,
  saveToLocalStorage,
  getFromLocalStorage,
  clearFromLocalStorage,
  updateSyncSettings,
  getSyncSettings,
  recordSync,
  isSyncDue
};
