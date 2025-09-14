const PUBLIC_VAPID_KEY = process.env.REACT_APP_VAPID_PUBLIC || '';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

export async function subscribeUser() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push desteklenmiyor.');
    return;
  }

  if (!PUBLIC_VAPID_KEY) {
    console.error('REACT_APP_VAPID_PUBLIC tanımlı değil!');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    await navigator.serviceWorker.ready;
    console.log('Service Worker kayıtlı ✅');

    // 🔹 Mevcut aboneliği kontrol et
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Yoksa yeni oluştur
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });
      console.log('Yeni push aboneliği oluşturuldu ✅');
    } else {
      console.log('Mevcut push aboneliği bulundu, tekrar kullanılacak ♻️');
    }

    const subJson = subscription.toJSON();

    // 🔹 Backend'e kaydet (retry destekli)
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch('https://countdown-push-server.onrender.com/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subJson),
        });

        if (res.status === 201) {
          console.log('Push aboneliği backend’e kaydedildi ✅');
          return subscription;
        } else if (res.status === 503) {
          console.warn('DB hazır değil, tekrar denenecek...');
        } else {
          console.error('Push backend hatası:', await res.text());
          return;
        }
      } catch (err) {
        console.warn('Push backend fetch hatası:', err);
      }
      await new Promise((r) => setTimeout(r, 2000));
    }

    console.error('Push aboneliği backend kaydı başarısız ❌');
  } catch (err) {
    console.error('Push aboneliği hatası:', err);
  }
}

// 🔹 Test: Lokal veya prod browser’da manuel push göndermek
export async function sendTestNotification(title = 'Test Notification', body = 'Bu bir testtir') {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker desteklenmiyor.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, { body });
    console.log('Manuel test bildirimi gösterildi ✅');
  } catch (err) {
    console.error('Manuel test bildirimi hatası:', err);
  }
}

// 🔹 Mevcut aboneliği almak için helper
export async function getSubscription() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (err) {
    console.error('Subscription alma hatası:', err);
    return null;
  }
}
