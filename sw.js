// sw.js - Handles incoming Web Push API triggers and standard offline fallbacks

self.addEventListener('push', function(event) {
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { 
        title: "2 Min Turnaround", 
        body: event.data.text() || "Stuck in a loop? Tap to launch a 120-second circuit breaker." 
      };
    }
  }

  const title = data.title || "Brain Reset Lifeline";
  const options = {
    body: data.body || "Tap to smash the button and shatter your current procrastination loop.",
    icon: data.icon || "https://flaticon.com",
    badge: data.badge || "https://flaticon.com", 
    vibrate: [100, 50, 100], 
    data: {
      url: (data.data && data.data.url) ? data.data.url : "/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
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
