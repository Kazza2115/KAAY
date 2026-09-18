import { useState } from 'react'
import type { PointGeo } from './distance'

/**
 * Position de la personne, demandée seulement quand elle le décide
 * (bouton épingle). Conservée au niveau du module pour survivre aux
 * navigations sans redemander la permission.
 */
let cachePosition: PointGeo | null = null

export type EtatPosition = 'inconnue' | 'recherche' | 'ok' | 'refusee'

export function usePosition() {
  const [etat, setEtat] = useState<EtatPosition>(cachePosition ? 'ok' : 'inconnue')
  const [position, setPosition] = useState<PointGeo | null>(cachePosition)

  function demander() {
    if (!('geolocation' in navigator)) {
      setEtat('refusee')
      return
    }
    setEtat('recherche')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        cachePosition = { lat: p.coords.latitude, lng: p.coords.longitude }
        setPosition(cachePosition)
        setEtat('ok')
      },
      () => setEtat('refusee'),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    )
  }

  return { etat, position, demander }
}
