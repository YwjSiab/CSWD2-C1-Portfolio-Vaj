// Service Worker for PWA: Handles caching for offline support

const CACHE_NAME = "portfolio-cache-v1"; // Unique cache name

// Files to cache for offline access
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./Projects.html",
  "./Resume.html",
  "./Contact.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install event: Pre-caches app shell
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // Activate SW immediately
});

// Fetch event: Serve from cache if available, else fetch from network
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedRes) => {
      return (
        cachedRes ||
        fetch(e.request)
          .then((networkRes) => {
            // Special handling to cache JSON responses (project list)
            if (e.request.url.includes("projects.json")) {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(e.request, networkRes.clone());
                return networkRes;
              });
            }
            return networkRes;
          })
          .catch(() => {
            // Fallback JSON if offline
            if (e.request.url.endsWith(".json")) {
              return new Response("[]", {
                headers: { "Content-Type": "application/json" },
              });
            }
          })
      );
    })
  );
});
