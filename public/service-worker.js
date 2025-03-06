// Service Worker for AllerPaws Keeper PWA

// Version for cache busting
const CACHE_VERSION = 'v2-no-cache-' + new Date().getTime();

// Skip caching - this service worker will bypass caches
self.addEventListener('install', (event) => {
  console.log('Service Worker installed - caching disabled');
  self.skipWaiting(); // Force activation
});

// Clean up any existing caches when activated
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated - removing all caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared');
      return self.clients.claim(); // Take control of all clients
    })
  );
});

// Network-only strategy - always fetch from network, bypass cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    .catch((error) => {
      console.error('Fetch failed:', error);
      // Return a simple offline response if network is unavailable
      if (event.request.mode === 'navigate') {
        return new Response('<html><body><h1>You are offline</h1></body></html>', {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      return new Response('Offline');
    })
  );
});

// Force clients to update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
