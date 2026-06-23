const CACHE_NAME = "william-trene-v66";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./hjelp.html",
  "./hjelp.md",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-1024.png",
  "./assets/apple-touch-icon.png",
  "./assets/help/progress-start.jpg",
  "./assets/help/progress-workout-10.jpg",
  "./assets/help/progress-workout-20.jpg",
  "./assets/badges/start-locked.jpg",
  "./assets/badges/start-earned.jpg",
  "./assets/badges/week-locked.jpg",
  "./assets/badges/week-earned.jpg",
  "./assets/badges/fifty-locked.jpg",
  "./assets/badges/fifty-earned.jpg",
  "./assets/badges/hundred-locked.jpg",
  "./assets/badges/hundred-earned.jpg",
  "./assets/badges/volume-beast-locked.jpg",
  "./assets/badges/volume-beast-earned.jpg",
  "./assets/badges/comeback-locked.jpg",
  "./assets/badges/comeback-earned.jpg",
  "./assets/badges/form-master-locked.jpg",
  "./assets/badges/form-master-earned.jpg",
  "./assets/badges/iron-streak-locked.jpg",
  "./assets/badges/iron-streak-earned.jpg",
  "./assets/badges/trifecta-locked.jpg",
  "./assets/badges/trifecta-earned.jpg",
  "./assets/badges/photo-king-locked.jpg",
  "./assets/badges/photo-king-earned.jpg",
  "./assets/badges/pro-mode-locked.jpg",
  "./assets/badges/pro-mode-earned.jpg",
  "./assets/badges/morning-warrior-locked.jpg",
  "./assets/badges/morning-warrior-earned.jpg",
  "./assets/exercises/pushups.jpg",
  "./assets/exercises/situps.jpg",
  "./assets/exercises/kneboy.jpg",
  "./assets/exercises/utfall.jpg",
  "./assets/exercises/planke.jpg",
  "./assets/exercises/sideplanke.jpg",
  "./assets/exercises/rygghev.jpg",
  "./assets/exercises/mountain-climbers.jpg",
  "./assets/exercises/dips-pa-benk.jpg",
  "./assets/exercises/hollow-hold.jpg",
  "./assets/exercises/burpees.jpg",
  "./assets/exercises/pullups-roing.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isAppShell =
    event.request.mode === "navigate" ||
    url.pathname.endsWith("/trene/") ||
    url.pathname.endsWith("/trene/index.html") ||
    url.pathname.endsWith("/trene/app.js") ||
    url.pathname.endsWith("/trene/styles.css") ||
    url.pathname.endsWith("/trene/hjelp.html") ||
    url.pathname.endsWith("/trene/hjelp.md") ||
    url.pathname.endsWith("/trene/manifest.webmanifest");

  if (isAppShell) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
