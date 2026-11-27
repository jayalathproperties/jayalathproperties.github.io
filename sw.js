/* JAYALATH PROPERTIES – app helper (service worker)
   - Pages: always try the internet first, so visitors see the latest listings.
     If there is no signal, show the last saved copy of THAT page
     (or the home page if that page was never opened before).
   - Logo, icons, pictures: served from the phone for speed, refreshed in the background.
   - Never touches WhatsApp, Google or any other website.
   When you change this file, change VERSION (e.g. jp-v3) so phones pick up the update. */
var VERSION = "jp-v3";
var CORE = ["./", "./index.html", "./manifest.webmanifest", "./assets/logo.svg", "./assets/icon-192.png", "./assets/voice.js?v=1"];

/* Each page gets its own saved copy. The home page is saved as "./". Extra text after ? is ignored. */
function pageKey(url) {
  var p = url.pathname;
  if (p.charAt(p.length - 1) === "/" || p.slice(-11) === "/index.html") return "./";
  return url.origin + p;
}

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;   // other websites: do nothing

  if (req.mode === "navigate") {                                            // pages: internet first
    var key = pageKey(url);
    e.respondWith(fetch(req).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(key, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(key).then(function (hit) { return hit || caches.match("./"); });
    }));
    return;
  }

  e.respondWith(caches.match(req).then(function (hit) {                     // files: phone first, refresh in background
    var net = fetch(req).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});
