import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

async function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      // 1️⃣ Mevcut kayıtlı tüm service worker'ları sil
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
      console.log('Previous Service Workers unregistered');

      // 2️⃣ Yeni service worker'ı register et
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('New Service Worker registered:', registration);
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  }
}

// SW başlat
initServiceWorker();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performans ölçümü
reportWebVitals();
