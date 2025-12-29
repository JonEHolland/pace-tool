// Service Worker for offline PWA support
// This will be automatically replaced with a unique hash during build
const CACHE_NAME = 'pace-tool-29e53a20';

console.log('[SW] Service worker loaded with cache:', CACHE_NAME);

self.addEventListener('install', (event) => {
  // Don't automatically skip waiting - let the app control when to update
  // Only skip waiting when user clicks "Update Now"
  console.log('[SW] Installing new service worker with cache:', CACHE_NAME);
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker:', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('[SW] Found caches:', cacheNames);
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Notifying clients of activation');
      // Notify all clients that activation is complete
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'ACTIVATED' });
        });
      });
    })
  );
  self.clients.claim();
});

// Listen for skip waiting message from the app
self.addEventListener('message', (event) => {
  console.log('[SW] Received message:', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skipping waiting...');
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  // For navigation requests (the main page load)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        // If both cache and network fail, return cached home page
        return caches.match('/');
      })
    );
  } else {
    // For all other requests
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

