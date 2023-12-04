self.addEventListener('install', (event) => {
  // Perform installation steps
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  // Perform activation steps
  console.log('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Check if the request is to an API
  if (request.url.includes('/api/')) {
    // Make a network request for API requests
    event.respondWith(fetch(request));
  } else if (request.mode === 'navigate') {
    // Serve a fallback HTML for navigation requests
    event.respondWith(fetch('/offline.html'));
  } else {
    // Serve other files directly without caching
    event.respondWith(fetch(request));
  }
});