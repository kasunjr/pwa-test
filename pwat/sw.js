// Basic service worker for PWA
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
});

self.addEventListener('fetch', (event) => {
  // Basic caching strategy (optional)
  event.respondWith(fetch(event.request));
});