/** Distance à vol d'oiseau entre la personne et un restaurant. */

export interface PointGeo {
  lat: number
  lng: number
}

const RAYON_TERRE_KM = 6371

/** Distance haversine en kilomètres. */
export function distanceKm(a: PointGeo, b: PointGeo): number {
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * RAYON_TERRE_KM * Math.asin(Math.sqrt(h))
}

/** « 850 m », « 1,2 km », « 12 km ». */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(50, Math.round(km * 1000 / 50) * 50)} m`
  if (km < 10) return `${km.toFixed(1).replace('.', ',')} km`
  return `${Math.round(km)} km`
}
