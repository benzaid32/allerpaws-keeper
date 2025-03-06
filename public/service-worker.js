
// AllerPaws Service Worker - No cache version (minimal)
// This version does not cache any assets to prevent refresh loops

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  
  // Clear any existing caches to prevent stale content
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          console.log('Clearing cache:', cache);
          return caches.delete(cache);
        })
      );
    })
  );
  
  return self.clients.claim(); // Take control of all clients
});

// Completely disable fetching - let the browser handle all requests normally
// This prevents any service worker-related refresh issues
self.addEventListener('fetch', (event) => {
  // Do nothing - let the browser handle all requests
  // This is the simplest and most reliable approach to prevent refresh issues
});

// Respond to ping messages to prevent the service worker from being terminated
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PING') {
    event.ports[0].postMessage('PONG');
  }
});
