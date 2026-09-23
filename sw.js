// Minimal Service Worker to pass Chrome PWA Installability Audit
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Daily Fortune Workout';
  const options = {
    body: data.body || 'Your daily task is ready!',
    icon: 'icon-192.png',
    data: data.data || {}
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
