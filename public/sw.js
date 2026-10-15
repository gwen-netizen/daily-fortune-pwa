const CACHE_NAME = 'attention-lifeboat-v20';

// 1. Force the new service worker to take over immediately
self.addEventListener('install', event => {
    self.skipWaiting();
});

// 2. Delete all old, broken caches so they never load again
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Network-First Strategy
self.addEventListener('fetch', event => {
    // Only cache standard GET requests (ignores Stripe/Supabase POST data)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
