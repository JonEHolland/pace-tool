// Service Worker Update Detection Hook

import { useState, useEffect } from 'react';

interface ServiceWorkerUpdateState {
  updateAvailable: boolean;
  updateAndReload: () => void;
  dismiss: () => void;
}

export function useServiceWorkerUpdate(): ServiceWorkerUpdateState {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // Only run in browser and if service workers are supported
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Check if there's already a waiting service worker
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setUpdateAvailable(true);
      }

      // Listen for new service worker being installed
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setUpdateAvailable(true);
            }
          });
        }
      });

      // Check for updates periodically (every 10 seconds)
      const interval = setInterval(() => {
        registration.update();
      }, 10000);

      return () => clearInterval(interval);
    });

    // Listen for controller change (when new SW activates)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

  }, []);

  const updateAndReload = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      // The controllerchange event will trigger reload
    }
  };

  const dismiss = () => {
    setUpdateAvailable(false);
  };

  return {
    updateAvailable,
    updateAndReload,
    dismiss
  };
}

