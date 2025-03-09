
// Flag to track if user has made any updates
let hasUserMadeChanges = false;

// Function to mark that user has made changes
export function markUserChanges() {
  console.log('User changes marked for sync');
  hasUserMadeChanges = true;
}

// Function to check if user has made changes
export function hasChanges(): boolean {
  return hasUserMadeChanges;
}

// Function to reset the changes flag after sync
export function resetChangesFlag() {
  console.log('Changes flag reset after sync');
  hasUserMadeChanges = false;
}

// Force sync function - used for initial loads and manual refresh
export function forceNextSync() {
  markUserChanges();
}
