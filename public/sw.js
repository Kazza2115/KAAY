/*
 * Service worker minimal de Kaay.
 *
 * - Pages (navigations) : réseau d'abord, copie en cache, repli hors-ligne
 *   sur la dernière version connue — jamais de page périmée en ligne.
 * - Fichiers du build (assets « hachés », icônes, illustrations) : cache
 *   d'abord — instantané et économe en données mobiles.
 */

const CACHE = 'kaay-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(
    caches
      .keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request
  if (requete.method !== 'GET' || new URL(requete.url).origin !== self.location.origin) return

  // Navigation : réseau d'abord, repli sur le cache hors connexion.
  if (requete.mode === 'navigate') {
    evenement.respondWith(
      fetch(requete)
        .then((reponse) => {
          const copie = reponse.clone()
          caches.open(CACHE).then((cache) => cache.put(requete, copie))
          return reponse
        })
        .catch(async () => {
          const enCache = await caches.match(requete)
          return enCache ?? caches.match(new URL('.', self.location.href).pathname)
        }),
    )
    return
  }

  // Fichiers statiques : cache d'abord, réseau en complément.
  evenement.respondWith(
    caches.match(requete).then(
      (enCache) =>
        enCache ??
        fetch(requete).then((reponse) => {
          if (reponse.ok) {
            const copie = reponse.clone()
            caches.open(CACHE).then((cache) => cache.put(requete, copie))
          }
          return reponse
        }),
    ),
  )
})
