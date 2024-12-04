const CACHE_NAME = "JesusVargas";
const urlsToCache = [
    './',
    './script.js',
    './serviceworker.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js',
    './img/imagen1.jpg',
    './img/imagen2.jpg',
    './img/imagen3.jpg',
    './img/imagen4.jpg',
    './img/imagen5.png',
    './img/imagen6.png',
    './img/perfil.jpg',
    './img/escritorio.png'
];

self.addEventListener('install', event => {
    console.log('[SW] Instalando el Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Cacheando archivos...');
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(error => {
                            console.error('Error al cachear:', url, error);
                        });
                    })
                );
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    console.log('[SW] Activando el Service Worker...');
    const listaBlancaCache = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(nombresCache => {
            return Promise.all(
                nombresCache.map(nombreCache => {
                    if (!listaBlancaCache.includes(nombreCache)) {
                        console.log('[SW] Eliminando caché antigua:', nombreCache);
                        return caches.delete(nombreCache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(respuestaCache => {
            return (
                respuestaCache ||
                fetch(event.request).then(respuestaRed => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, respuestaRed.clone());
                        return respuestaRed;
                    });
                })
            );
        })
    );
});
