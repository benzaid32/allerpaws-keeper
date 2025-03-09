
// This declaration file extends the ServiceWorkerRegistration interface
// to include the Background Sync API which is not in the default TypeScript types

interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistration {
  // Add the sync property to ServiceWorkerRegistration
  sync: SyncManager;
}
