/* Eunomi · Levantamiento · funciona sin internet dentro del local.
   Red primero (para recibir actualizaciones) y copia guardada si no hay señal. */
var CACHE = "eunomi-levantamiento-b64d89982f";
var FILES = ["/levantamiento", "/levantamiento.webmanifest", "/brand-mark.svg"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.add("/levantamiento").then(function () {
      return Promise.all(FILES.slice(1).map(function (f) { return c.add(f).catch(function () {}); }));
    });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("eunomi-levantamiento-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  var key = FILES.indexOf(url.pathname) >= 0 ? url.pathname : null;
  if (!key) return;
  // Con señal débil no esperar más de 3 s: usar la copia guardada y actualizar por detrás.
  var red = fetch(e.request).then(function (r) {
    if (r.ok) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(key, copy); }); }
    return r;
  });
  e.respondWith(caches.match(key).then(function (guardada) {
    if (!guardada) return red;
    var espera = new Promise(function (ok) { setTimeout(function () { ok(guardada); }, 3000); });
    return Promise.race([red.catch(function () { return guardada; }), espera]);
  }));
});
