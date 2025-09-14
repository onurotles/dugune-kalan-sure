const CACHE_NAME = "countdown-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json"];

// Install event
self.addEventListener("install", (event) => {
  console.log("[SW] Install event");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Push event
self.addEventListener("push", (event) => {
  console.log("[SW] Push event geldi", event);

  let data = { title: "Bildirim", body: "Yeni mesaj var!" };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (err) {
    console.error("[SW] Push verisi parse edilemedi", err);
  }

  const options = {
    body: data.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    vibrate: [100, 50, 100],
    data: { timestamp: Date.now() },
  };

  // Konsola log
  console.log("[SW] Push verisi", data);

  // Bildirimi göster
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  console.log("[SW] Bildirim tıklandı", event.notification);

  // Örnek: siteyi aç
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        clientList[0].focus();
      } else {
        clients.openWindow("/");
      }
    })
  );
});
