// Minimal service worker for the Bagdad Admin PWA.
// It only caches the static app shell (HTML/CSS/icons) so the panel can be
// installed and opens instantly — it does NOT cache Firestore data, so
// orders/stock/etc. always come in fresh over the network.

// v2: fixes a bug where, if a request was not yet cached AND the network
// fetch failed (e.g. a flaky mobile connection), the fetch handler could
// resolve with `undefined`. Chrome treats that as a hard network error and
// shows "This site can't be reached — ERR_FAILED" — which is exactly what
// was happening on phones with unstable signal. This version always
// resolves to a real Response.
const CACHE_NAME = "bagdad-admin-shell-v2";
const SHELL_FILES = [
  "/admin.html",
  "/admin.js",
  "/admin-manifest.json",
  "/images/logo.jpg",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;

  // Only handle simple GET navigations/assets. Let everything else
  // (POST, etc.) go straight to the network untouched.
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Never intercept Firebase/Firestore/Auth calls — those must always hit
  // the network live. Only serve the static app shell from cache.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      let cached;
      try {
        cached = await caches.match(req);
      } catch (err) {
        cached = undefined;
      }

      // Kick off a network request regardless, so the cache stays fresh.
      const networkFetch = fetch(req)
        .then(response => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone)).catch(() => {});
          }
          return response;
        })
        .catch(() => null);

      if (cached) {
        // Serve the cached shell instantly; update the cache in the
        // background without blocking or failing this response.
        networkFetch.catch(() => {});
        return cached;
      }

      const networkResponse = await networkFetch;
      if (networkResponse) return networkResponse;

      // Both cache and network failed. For page navigations, fall back to
      // the cached admin shell if we have one, so the app still opens.
      if (req.mode === "navigate") {
        try {
          const shell = await caches.match("/admin.html");
          if (shell) return shell;
        } catch (err) {
          /* ignore */
        }
      }

      // Last resort: return a real (if unhelpful) Response instead of
      // letting the browser surface ERR_FAILED.
      return new Response(
        "You're offline and this page isn't cached yet. Please check your connection and try again.",
        { status: 503, statusText: "Service Unavailable", headers: { "Content-Type": "text/plain" } }
      );
    })()
  );
});
