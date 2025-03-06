// AllerPaws Service Worker - No cache version
// This version does not cache any assets to prevent refresh loops

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // This forces the waiting service worker to become the active service worker
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

// Simple pass-through fetch handler - does not cache anything
self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests to avoid CORS issues
  if (new URL(event.request.url).origin === self.location.origin) {
    // Only use network requests, no caching
    event.respondWith(
      fetch(event.request)
        .catch(error => {
          console.error('Fetch error:', error);
          // Return a simple offline page if network request fails
          return new Response('You are offline', { 
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
  }
});

// Prevent service worker from going to sleep and causing refresh issues
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PING') {
    // Respond to keep alive pings
    event.ports[0].postMessage('PONG');
  }
});
