const CACHE_NAME = "countdown-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json"];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});

// 🔹 Push event
self.addEventListener("push", (event) => {
  console.log("[SW] Push event geldi", event);

  let data = { title: "Bildirim", body: "Yeni bildirim!" };
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: "/icon-192.png", // varsa ikon
    badge: "/icon-192.png",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 🔹 Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click");
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow("/");
    })
  );
});
