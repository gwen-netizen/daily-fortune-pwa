// Service Worker for Daily Fortune Workout PWA

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle Incoming Web Push
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Daily Fortune Workout';
  const options = {
    body: data.body || 'Your daily task is ready!',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: data.data || {}
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle Notification Taps (Routes directly to 9:30 PM reflection)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data && event.notification.data.isEvening 
    ? '/index.html?checkin=true' 
    : '/index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
