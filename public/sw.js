// Minimal service worker to satisfy registration and avoid 404
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('sw: installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  console.log('sw: activated');
});

// Basic fetch handler - passthrough to network
self.addEventListener('fetch', (event) => {
  // You can customize caching strategies here later
  event.respondWith(fetch(event.request));
});
