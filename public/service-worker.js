// Minimal service worker - only keeping it for PWA compliance
// This version deliberately does nothing to prevent refresh loops

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  return self.clients.claim();
});

// No fetch handler to prevent interference with normal browser behavior
