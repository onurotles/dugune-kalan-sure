import React, { useEffect } from "react";
import Countdown from "./Countdown";

const App: React.FC = () => {
  // Push register ve abonelik
  useEffect(() => {
    async function registerPush() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      try {
        // Service Worker register
        const registration = await navigator.serviceWorker.register("/service-worker.js");

        // SW aktif olana kadar bekle
        await navigator.serviceWorker.ready;

        // Push izin iste
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("Push bildirimi için izin verilmedi");
          return;
        }

        // Push aboneliği oluştur
        const vapidKey = process.env.REACT_APP_VAPID_PUBLIC;
        if (!vapidKey) {
          console.error("VAPID public key bulunamadı! .env dosyasını kontrol et.");
          return;
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        // Backend'e gönder
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/subscribe`, {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: { "Content-Type": "application/json" },
        });

        console.log("Push aboneliği kaydedildi ✅");
      } catch (err) {
        console.error("Push aboneliği hatası:", err);
      }
    }

    registerPush();
  }, []);

  // Cache temizleme: eski SW varsa kaldır
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => reg.unregister());
      });
    }
  }, []);

  return (
    <div>
      <Countdown />
    </div>
  );
};

// Helper fonksiyon
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default App;
