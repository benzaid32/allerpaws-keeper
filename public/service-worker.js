
// Cache names
const STATIC_CACHE_NAME = 'allerpaws-static-v1';
const DYNAMIC_CACHE_NAME = 'allerpaws-dynamic-v1';
const DATA_CACHE_NAME = 'allerpaws-api-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/favicon.ico',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon.png',
  '/icons/apple-icon-152.png',
  '/icons/apple-icon-167.png',
  '/icons/apple-icon-180.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Successfully installed and cached static assets');
        return self.skipWaiting(); // Ensure the new service worker activates immediately
      })
      .catch(error => {
        console.error('[Service Worker] Failed to pre-cache assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== STATIC_CACHE_NAME && 
              key !== DYNAMIC_CACHE_NAME &&
              key !== DATA_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim(); // Take control of all clients
      })
  );
});

// Helper function to determine if a request is for API data
const isApiRequest = (url) => {
  const parsedUrl = new URL(url);
  return (
    parsedUrl.pathname.includes('/rest/v1') || 
    parsedUrl.pathname.includes('/auth/v1') ||
    parsedUrl.hostname.includes('supabase')
  );
};

// Helper function to determine if a request is a navigation request
const isNavigationRequest = (request) => {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      request.headers.get('accept').includes('text/html'))
  );
};

// Fetch event - handle network requests with appropriate strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin && !url.hostname.includes('supabase')) {
    return;
  }

  // Special handling for API requests - Network first, fallback to cache
  if (isApiRequest(request.url)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response to store in cache and return the original
          const clonedResponse = response.clone();
          
          caches.open(DATA_CACHE_NAME)
            .then(cache => {
              // Only cache successful responses
              if (response.status === 200) {
                cache.put(request, clonedResponse);
              }
            });
          
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not in cache, return a basic offline response for API requests
              return new Response(
                JSON.stringify({ error: 'You are offline' }), 
                { 
                  status: 503,
                  headers: { 'Content-Type': 'application/json' } 
                }
              );
            });
        })
    );
    return;
  }

  // For navigation requests (HTML pages) - Network first, fallback to cache
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response to store in cache
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then(cache => cache.put(request, clonedResponse));
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Fallback to index.html for SPA routes
              return caches.match('/index.html');
            });
        })
    );
    return;
  }

  // For all other requests - Cache first, fallback to network
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cache but update cache in background
          const fetchPromise = fetch(request)
            .then(networkResponse => {
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                  cache.put(request, networkResponse.clone());
                });
              return networkResponse;
            })
            .catch(() => cachedResponse);
          
          return cachedResponse;
        }
        
        // If not in cache, fetch from network and cache
        return fetch(request)
          .then(response => {
            const clonedResponse = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(request, clonedResponse);
              });
            return response;
          });
      })
  );
});

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received:', event);
  
  if (!event.data) {
    console.log('[Service Worker] No data received with push event');
    return;
  }
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New notification from AllerPaws',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/maskable-icon.png',
      data: {
        url: data.url || '/'
      },
      vibrate: [100, 50, 100],
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'AllerPaws Notification', options)
    );
  } catch (error) {
    console.error('[Service Worker] Error processing push notification:', error);
  }
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window/tab is open or available, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Sync event handler for background sync
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync event:', event);
  
  if (event.tag === 'sync-pets') {
    console.log('[Service Worker] Syncing pets data');
    event.waitUntil(syncPets());
  } else if (event.tag === 'sync-symptoms') {
    console.log('[Service Worker] Syncing symptom entries');
    event.waitUntil(syncSymptoms());
  } else if (event.tag === 'sync-food') {
    console.log('[Service Worker] Syncing food entries');
    event.waitUntil(syncFood());
  }
});

// Helper function to synchronize pets data
const syncPets = async () => {
  try {
    // Force fetch fresh data from server
    const response = await fetch('/api/sync/pets', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Update clients that this data has been synced
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        tag: 'sync-pets'
      });
    });
    
    return true;
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    return false;
  }
};

// Helper functions for syncing other data types
const syncSymptoms = async () => {
  // Similar implementation to syncPets
  console.log('[Service Worker] syncSymptoms called but not implemented');
  return true;
};

const syncFood = async () => {
  // Similar implementation to syncPets
  console.log('[Service Worker] syncFood called but not implemented');
  return true;
};

// Periodically check for updates (every 15 minutes)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Log any errors
self.addEventListener('error', (event) => {
  console.error('[Service Worker] Error:', event.message, event.filename, event.lineno);
});

console.log('[Service Worker] Service worker registered successfully');
