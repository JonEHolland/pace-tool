// Service Worker for offline PWA support
// This will be automatically replaced with a unique hash during build
const CACHE_NAME = 'pace-tool-0060334b';

self.addEventListener('install', (event) => {
  // Don't automatically skip waiting - let the app control when to update
  // Only skip waiting when user clicks "Update Now"
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
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
  if (event.data && event.data.type === 'SKIP_WAITING') {
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

