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

    // Mevcut aboneliği kontrol et
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });
      console.log('Yeni push aboneliği oluşturuldu ✅');
    } else {
      console.log('Mevcut push aboneliği bulundu, tekrar kullanılacak ♻️');
    }

    const subJson = subscription.toJSON();

    // Backend'e kaydet
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subJson),
        });

        if (res.status === 201) {
          console.log('Push aboneliği backend’e kaydedildi ✅');
          return;
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
