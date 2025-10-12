// MindGlow Service Worker - Advanced PWA
// A product of Bradley Virtual Solutions, LLC

const CACHE_NAME = 'mindglow-v3.0.0';
const RUNTIME_CACHE = 'mindglow-runtime-v3.0.0';

// Files to cache for offline use
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/main.js',
  '/js/config.js',
  '/js/firebase-init.js',
  '/js/auth/auth.js',
  '/js/utils/state.js',
  '/js/utils/storage.js',
  '/js/utils/navigation.js',
  '/js/utils/theme.js',
  '/js/utils/helpers.js',
  '/js/features/dashboard.js',
  '/js/features/meditation.js',
  '/js/features/breathing.js',
  '/js/features/wellness.js',
  '/js/features/journal.js',
  '/js/features/community.js',
  '/js/features/library.js',
  '/js/features/settings.js',
  '/js/features/pomodoro.js',
  '/js/data/quotes.js',
  '/js/data/meditations.js',
  '/js/data/sounds.js',
  '/js/data/affirmations.js',
  '/js/data/content.js',
  '/js/data/mindful-eating.js',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Precaching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip Firebase and external APIs
  if (event.request.url.includes('firebase') || 
      event.request.url.includes('googleapis') ||
      event.request.url.includes('gstatic')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached version
        return cachedResponse;
      }

      // Clone the request
      return fetch(event.request.clone()).then(response => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone response to cache
        const responseToCache = response.clone();
        
        caches.open(RUNTIME_CACHE).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[Service Worker] Syncing offline data...');
  // This would sync any offline changes when back online
  // For now, just log the event
  return Promise.resolve();
}

// Push notifications (future enhancement)
self.addEventListener('push', event => {
  console.log('[Service Worker] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Time for your daily meditation!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'mindglow-reminder',
    requireInteraction: false,
    actions: [
      { action: 'meditate', title: 'Start Session' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MindGlow Reminder', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'meditate') {
    event.waitUntil(
      clients.openWindow('/?action=quick-meditate')
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[Service Worker] Loaded successfully');

