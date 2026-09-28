// sw.js - Handles incoming Web Push API triggers on mobile devices

self.addEventListener('push', function(event) {
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Fortune Workout", body: event.data.text() };
    }
  }

  const title = data.title || "Daily Guidance";
  const options = {
    body: data.body || "Tap to view your daily fortune workout.",
    icon: data.icon || "/icon-192.png",
    badge: data.badge || "/icon-192.png", // Falls back to the main icon if a specific badge isn't available
    vibrate: [100, 50, 100],
    data: {
      url: (data.data && data.data.url) ? data.data.url : "/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handles tap/click on mobile pull-down banner
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Safely extracts the URL from the notification payload, defaulting to the root app path
  const urlToOpen = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // If the PWA is already open in the background, bring it to the foreground
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // If the PWA is fully closed, launch it
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
