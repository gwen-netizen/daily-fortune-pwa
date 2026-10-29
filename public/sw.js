const CACHE_NAME = '120reset-v19-speed';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/app.html',
  '/styles.css',
  '/app.js',
  '/neuron-fibers.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) return;
  
  // Stale-While-Revalidate: Instant load from cache, silent update from network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {}); // Fails silently if offline, no freezing
      
      return cachedResponse || fetchPromise;
    })
  );
});

/* ========================================================
   WEB PUSH NOTIFICATIONS & CLICK LISTENERS
======================================================== */

// 1. Listen for incoming Push Notifications from Vercel/WebPush
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || "Your 48-Hour Unlimited Pass is ready to claim!",
      icon: '/images/icon-192.png',
      badge: '/images/icon-192.png',
      data: { url: data.url || '/app.html?claimReferral=true' }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "🎁 Referral Reward Unlocked!", options)
    );
  } catch (err) {
    console.error('Error parsing push payload:', err);
  }
});

// 2. Handle notification tap (opens or focuses app)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/app.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/app.html') && 'focus' in client) {
          client.postMessage({ action: 'open_referral_modal' });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
