// AllerPaws PWA Service Worker
const CACHE_NAME = 'allerpaws-cache-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon.png'
];

// Routes that should be handled by the SPA
const SPA_ROUTES = [
  '/landing',
  '/auth',
  '/dashboard',
  '/settings',
  '/profile',
  '/pets',
  '/add-pet',
  '/edit-pet',
  '/pet',
  '/food-database',
  '/symptom-diary',
  '/reminders',
  '/add-symptom',
  '/edit-symptom',
  '/elimination-diet',
  '/pricing',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/cookies',
  '/faqs',
  '/help',
  '/blog',
  '/careers'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  // Precache core assets
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .catch(error => {
        console.error('Service Worker: Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  // Claim clients to ensure the service worker controls all pages
  event.waitUntil(self.clients.claim());
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Helper function to check if a request is for an SPA route
function isSpaRoute(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  
  // Check if the pathname starts with any of our SPA routes
  return SPA_ROUTES.some(route => pathname.startsWith(route));
}

// Fetch event - network-first strategy with fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and browser extensions
  if (
    event.request.method !== 'GET' ||
    event.request.url.startsWith('chrome-extension') ||
    event.request.url.includes('extension') ||
    // Skip analytics and third-party requests
    event.request.url.includes('google-analytics') ||
    event.request.url.includes('googletagmanager') ||
    // Skip service worker registration
    event.request.url.includes('service-worker.js')
  ) {
    return;
  }
  
  // For HTML pages or SPA routes - network first, then cache, fallback to index.html
  if (
    event.request.headers.get('accept')?.includes('text/html') ||
    isSpaRoute(event.request.url)
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the latest version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request)
            .then(cachedResponse => {
              // If we have a cached response, use it
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // For SPA routes, return the index.html
              if (isSpaRoute(event.request.url)) {
                return caches.match('/index.html');
              }
              
              // Fallback to root
              return caches.match('/');
            });
        })
    );
    return;
  }
  
  // For other assets - try cache first, then network
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached response
        return cachedResponse;
      }
      
      // If not in cache, fetch from network
      return fetch(event.request)
        .then(response => {
          // Cache the new response for future
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(error => {
          console.error('Service Worker: Fetch failed:', error);
          // For image requests, return a fallback image
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return caches.match('/placeholder.svg');
          }
          // Otherwise just propagate the error
          throw error;
        });
    })
  );
});
