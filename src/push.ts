const PUBLIC_VAPID_KEY = 'BJdmdS87qYiSR-beG-ugV7PwZx5LMVo0tsGbKxRtpKR-GuB57LcIYogZQQpCVfjNEGj1ozBnou9z5pYlmPDHgn8'; // Node.js’de ürettiğin public key

// URL Base64 → Uint8Array dönüşümü
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

// Push aboneliği alma ve backend’e gönderme
export async function subscribeUser() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    // Backend’e gönder
    try {
        const res = await fetch('https://countdown-push-server.onrender.com/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Subscription failed');
        } catch(err) {
        console.error('Push subscription hatası:', err);
    }

    console.log('Push subscription alındı ✅');
  }
}
