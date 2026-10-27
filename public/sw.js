const CACHE_NAME = '120reset-v6-live';

self.addEventListener('install', (event) => {
  // Install immediately without caching assets
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Aggressively delete ALL existing caches on the user's device
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Strictly Network-Only strategy. No local cache fallback.
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request));
});
