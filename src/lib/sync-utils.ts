
// Flag to track if user has made any changes
let hasUserMadeChanges = false;

// Flag to track if initial load has occurred
let initialLoadCompleted = false;

// Function to mark that user has made changes
export function markUserChanges() {
  console.log('User changes marked for sync');
  hasUserMadeChanges = true;
}

// Function to check if user has made changes
export function hasChanges(): boolean {
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
export function resetChangesFlag() {
  console.log('Changes flag reset after sync');
  hasUserMadeChanges = false;
}

// Force sync function - used for initial loads and manual refresh
export function forceNextSync() {
  console.log('Forcing next sync');
  markUserChanges();
}

// Reset all flags - for testing and troubleshooting
export function resetAllFlags() {
  hasUserMadeChanges = false;
  initialLoadCompleted = false;
  console.log('All sync flags reset');
}
