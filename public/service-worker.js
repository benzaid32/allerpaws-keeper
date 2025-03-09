// This is the service worker script, install event listener
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker ...', event);
  // Perform install steps
  event.waitUntil(
    caches.open('allerpaws-static-v1').then((cache) => {
      console.log('[Service Worker] Precaching App shell');
      cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/fallback.svg',
        '/icon-192x192.png',
        '/icon-512x512.png',
        '/vite.svg'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate event listener
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== 'allerpaws-static-v1' && key !== 'allerpaws-dynamic-v1' && key !== 'allerpaws-api-v1') {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API request handling
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clonedRes = res.clone();
          return caches.open('allerpaws-api-v1').then((cache) => {
            cache.put(event.request, clonedRes);
            return res;
          });
        })
        .catch(() => {
          return caches.match(event.request).then((response) => {
            if (response) {
              return response;
            }
            // If the request is not in the API cache, return an offline response
            return new Response(null, {
              status: 404,
              statusText: 'Offline'
            });
          });
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then((res) => {
          // Handle dynamic content caching
          if (res.status === 200 && event.request.method === 'GET') {
            return caches.open('allerpaws-dynamic-v1').then((cache) => {
              cache.put(event.request.url, res.clone());
              return res;
            });
          } else {
            return res;
          }
        })
        .catch((err) => {
          // Fallback for static assets
          return caches.open('allerpaws-static-v1').then((cache) => {
            if (event.request.headers.get('accept').includes('text/html')) {
              return cache.match('/offline.html');
            } else if (event.request.headers.get('accept').includes('image/*')) {
              return cache.match('/fallback.svg');
            }
          });
        });
    })
  );
});

// Function to sync pets data
async function syncPets() {
  try {
    console.log('[Service Worker] Syncing pets data');
    
    // Fetch the pets data to refresh cache
    const cache = await caches.open('allerpaws-api-v1');
    
    // Create cache-busting URL to ensure fresh data
    const timestamp = new Date().getTime();
    const petsUrl = '/api/pets?t=' + timestamp;
    
    // Try to fetch fresh data and update cache
    try {
      const response = await fetch(petsUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      // If successful, update cache and send message to client
      if (response.ok) {
        await cache.put(petsUrl, response.clone());
        
        // Notify clients that sync is complete
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            tag: 'sync-pets'
          });
        });
      }
    } catch (error) {
      console.error('[Service Worker] Error syncing pets:', error);
    }
    
    return true;
  } catch (error) {
    console.error('[Service Worker] Error in syncPets:', error);
    return false;
  }
}

// Function to sync symptoms data
async function syncSymptoms() {
  try {
    console.log('[Service Worker] Syncing symptoms data');
    
    // Fetch the symptoms data to refresh cache
    const cache = await caches.open('allerpaws-api-v1');
    
    // Create cache-busting URL to ensure fresh data
    const timestamp = new Date().getTime();
    const symptomsUrl = '/api/symptoms?t=' + timestamp;
    
    // Try to fetch fresh data and update cache
    try {
      const response = await fetch(symptomsUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      // If successful, update cache and send message to client
      if (response.ok) {
        await cache.put(symptomsUrl, response.clone());
        
        // Notify clients that sync is complete
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            tag: 'sync-symptoms'
          });
        });
      }
    } catch (error) {
      console.error('[Service Worker] Error syncing symptoms:', error);
    }
    
    return true;
  } catch (error) {
    console.error('[Service Worker] Error in syncSymptoms:', error);
    return false;
  }
}

// Function to sync food entries
async function syncFood() {
  try {
    console.log('[Service Worker] Syncing food entries data');
    
    // Fetch the food entries data to refresh cache
    const cache = await caches.open('allerpaws-api-v1');
    
    // Create cache-busting URL to ensure fresh data
    const timestamp = new Date().getTime();
    const foodUrl = '/api/food-entries?t=' + timestamp;
    
    // Try to fetch fresh data and update cache
    try {
      const response = await fetch(foodUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      // If successful, update cache and send message to client
      if (response.ok) {
        await cache.put(foodUrl, response.clone());
        
        // Notify clients that sync is complete
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            tag: 'sync-food'
          });
        });
      }
    } catch (error) {
      console.error('[Service Worker] Error syncing food entries:', error);
    }
    
    return true;
  } catch (error) {
    console.error('[Service Worker] Error in syncFood:', error);
    return false;
  }
}

// Add the sync handler code or update it if it exists:
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync event:', event);
  
  if (event.tag === 'sync-pets') {
    console.log('[Service Worker] Syncing pets');
    event.waitUntil(syncPets());
  }
  else if (event.tag === 'sync-symptoms') {
    console.log('[Service Worker] Syncing symptoms');
    event.waitUntil(syncSymptoms());
  }
  else if (event.tag === 'sync-food') {
    console.log('[Service Worker] Syncing food entries');
    event.waitUntil(syncFood());
  }
  else if (event.tag === 'sync-reminders') {
    console.log('[Service Worker] Syncing reminders');
    event.waitUntil(syncReminders());
  }
});

// Function to sync reminders
async function syncReminders() {
  try {
    console.log('[Service Worker] Syncing reminders data');
    
    // Fetch the reminders data to refresh cache
    const cache = await caches.open('allerpaws-api-v1');
    
    // Create cache-busting URL to ensure fresh data
    const timestamp = new Date().getTime();
    const remindersUrl = '/api/reminders?t=' + timestamp;
    
    // Try to fetch fresh data and update cache
    try {
      const response = await fetch(remindersUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      // If successful, update cache and send message to client
      if (response.ok) {
        await cache.put(remindersUrl, response.clone());
        
        // Notify clients that sync is complete
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            tag: 'sync-reminders'
          });
        });
      }
    } catch (error) {
      console.error('[Service Worker] Error syncing reminders:', error);
    }
    
    return true;
  } catch (error) {
    console.error('[Service Worker] Error in syncReminders:', error);
    return false;
  }
}

// Listen for skip waiting messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
