// sw.js - Handles push events and focuses the PWA tab

self.addEventListener('push', function(event) {
  // If the push comes from an external remote server (fallback support)
  let data = { title: "2-min", body: "Tap to break your friction loop." };
  if (event.data) {
    try { data = event.data.json(); } 
    catch (e) { data.body = event.data.text(); }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "https://flaticon.com",
      vibrate: [100, 50, 100],
      data: { url: "/" }
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
