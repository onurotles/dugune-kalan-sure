// src/push.ts
const PUBLIC_VAPID_KEY = process.env.REACT_APP_VAPID_PUBLIC || ''; // .env dosyasından alınacak

// URL Base64 → Uint8Array dönüşümü
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

// Push aboneliği alma ve backend’e gönderme
export async function subscribeUser() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker desteklenmiyor.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (!registration) throw new Error('Service Worker hazır değil.');

    if (!('PushManager' in window)) {
      console.warn('Push notifications desteklenmiyor.');
      return;
    }

    if (!PUBLIC_VAPID_KEY) throw new Error('REACT_APP_VAPID_PUBLIC tanımlı değil!');

    const applicationServerKey = urlBase64ToUint8Array(PUBLIC_VAPID_KEY);

    let subscription: PushSubscription | null = null;

    // Retry: 5 kez deneyelim
    for (let i = 0; i < 5; i++) {
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });
        break;
      } catch (err: any) {
        console.warn(`Push subscribe denemesi ${i + 1} başarısız:`, err);
        await new Promise((r) => setTimeout(r, 2000)); // 2 saniye bekle
      }
    }

    if (!subscription) {
      console.error('Push aboneliği alınamadı ❌');
      return;
    }

    // Backend’e abonelik gönder
    let res: Response | null = null;
    for (let i = 0; i < 5; i++) {
      try {
        res = await fetch('https://countdown-push-server.onrender.com/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });

        if (res.status === 201) {
          console.log('Push aboneliği kaydedildi ✅');
          return;
        } else if (res.status === 503) {
          console.warn('DB henüz hazır değil, tekrar denenecek...');
        } else {
          console.error('Push backend hatası:', await res.text());
          return;
        }
      } catch (err) {
        console.warn('Push backend fetch hatası:', err);
      }
      await new Promise((r) => setTimeout(r, 2000)); // 2 saniye bekle
    }

    console.error('Push aboneliği backend kaydı başarısız ❌');
  } catch (err) {
    console.error('Push aboneliği hatası:', err);
  }
}
