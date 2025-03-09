
// Flag to track if user has made any changes
let hasUserMadeChanges = false;

// Flag to track if initial load has occurred
let initialLoadCompleted = false;

// Flag to track specific data types that have changed
const changedDataTypes = {
  pets: false,
  symptoms: false,
  food: false,
  reminders: false
};

// Function to mark that user has made changes
export function markUserChanges(dataType?: 'pets' | 'symptoms' | 'food' | 'reminders') {
  console.log(`User changes marked for sync${dataType ? ` (${dataType})` : ''}`);
  hasUserMadeChanges = true;
  
  // If a specific data type is provided, mark it as changed
  if (dataType) {
    changedDataTypes[dataType] = true;
    
    // Dispatch an event to trigger refreshes in the same tab
    const event = new Event(`${dataType}-data-changed`);
    window.dispatchEvent(event);
    
    // Update localStorage to notify other tabs
    try {
      localStorage.setItem(`${dataType}_updated`, Date.now().toString());
    } catch (e) {
      console.warn(`Could not update localStorage for cross-tab notification of ${dataType}`, e);
    }
  }
}

// Function to check if user has made changes
export function hasChanges(dataType?: 'pets' | 'symptoms' | 'food' | 'reminders'): boolean {
  // If a specific data type is provided, check only that type
  if (dataType) {
    return changedDataTypes[dataType];
  }
  // Otherwise, check if any changes were made
  return hasUserMadeChanges;
}

// Function to check if initial load has been completed
export function isInitialLoadCompleted(): boolean {
  return initialLoadCompleted;
}

// Function to mark initial load as completed
export function markInitialLoadCompleted() {
  console.log('Initial data load completed');
  initialLoadCompleted = true;
}

// Function to reset the changes flag after sync
export function resetChangesFlag(dataType?: 'pets' | 'symptoms' | 'food' | 'reminders') {
  if (dataType) {
    console.log(`Changes flag reset for ${dataType} after sync`);
    changedDataTypes[dataType] = false;
    
    // Check if all data types are synced
    const allSynced = !Object.values(changedDataTypes).some(value => value);
    if (allSynced) {
      hasUserMadeChanges = false;
      console.log('All data types synced, global changes flag reset');
    }
  } else {
    console.log('All changes flags reset after sync');
    hasUserMadeChanges = false;
    Object.keys(changedDataTypes).forEach(key => {
      changedDataTypes[key as keyof typeof changedDataTypes] = false;
    });
  }
}

// Force sync function - used for initial loads and manual refresh
export function forceNextSync(dataType?: 'pets' | 'symptoms' | 'food' | 'reminders') {
  console.log(`Forcing next sync${dataType ? ` for ${dataType}` : ''}`);
  if (dataType) {
    changedDataTypes[dataType] = true;
  } else {
    Object.keys(changedDataTypes).forEach(key => {
      changedDataTypes[key as keyof typeof changedDataTypes] = true;
    });
  }
  hasUserMadeChanges = true;
}

// Reset all flags - for testing and troubleshooting
export function resetAllFlags() {
  hasUserMadeChanges = false;
  initialLoadCompleted = false;
  Object.keys(changedDataTypes).forEach(key => {
    changedDataTypes[key as keyof typeof changedDataTypes] = false;
  });
  console.log('All sync flags reset');
}

// Debug function to log current state of all flags
export function logSyncState() {
  console.log({
    hasUserMadeChanges,
    initialLoadCompleted,
    changedDataTypes
  });
}

// Trigger refresh for specific data type
export function triggerDataRefresh(dataType: 'pets' | 'symptoms' | 'food' | 'reminders') {
  console.log(`Triggering refresh for ${dataType}`);
  
  // Force a full refresh by marking as changed
  changedDataTypes[dataType] = true;
  hasUserMadeChanges = true;
  
  // Dispatch event for same-tab updates
  window.dispatchEvent(new Event(`${dataType}-data-changed`));
  
  // Update localStorage for cross-tab updates
  try {
    localStorage.setItem(`${dataType}_updated`, Date.now().toString());
  } catch (e) {
    console.warn(`Could not update localStorage for cross-tab notification of ${dataType}`, e);
  }
}
