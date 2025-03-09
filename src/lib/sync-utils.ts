
// Flag to track if user has made any updates
let hasUserMadeChanges = false;

// Function to mark that user has made changes
export function markUserChanges() {
  hasUserMadeChanges = true;
}

// Function to check if user has made changes
export function hasChanges(): boolean {
  return hasUserMadeChanges;
}

// Function to reset the changes flag after sync
export function resetChangesFlag() {
  hasUserMadeChanges = false;
}
