// sw.js - Handles incoming Web Push API triggers on mobile devices

self.addEventListener('push', function(event) {
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      // Rebranded fallback title and copy to match the new psychological framing
      data = { 
        title: "2 Min Turnaround", 
        body: event.data.text() || "Stuck in a loop? Tap to launch a 120-second circuit breaker." 
      };
    }
  }

  const title = data.title || "Brain Reset Available";
  const options = {
    body: data.body || "Tap to smash the button and shatter your current procrastination loop.",
    // Updated default paths to a generic icon naming convention
    icon: data.icon || "/icon-512.png",
    badge: data.badge || "/icon-512.png", 
    // Double pulse pattern designed to penetrate deep attention blocks
    vibrate:, 
    data: {
      url: (data.data && data.data.url) ? data.data.url : "/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handles tap/click on mobile pull-down banner notifications
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Safely extracts the URL from the notification payload, defaulting to the root app path
  const urlToOpen = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // If the PWA is already open in the background, bring it to the foreground immediately
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // If the PWA is fully closed, launch it instantly
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
