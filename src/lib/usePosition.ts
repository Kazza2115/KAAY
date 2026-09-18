import { useEffect, useState } from 'react'
import type { PointGeo } from './distance'

/**
 * Position de la personne. Demandée automatiquement à la première visite
 * (`auto`), puis relançable par le bouton épingle. Conservée au niveau du
 * module pour survivre aux navigations sans redemander la permission.
 */
let cachePosition: PointGeo | null = null
let demandeAutoFaite = false

export type EtatPosition = 'inconnue' | 'recherche' | 'ok' | 'refusee'

export function usePosition(auto = false) {
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

  // Une seule demande automatique par session : ensuite, c'est le bouton.
  useEffect(() => {
    if (auto && !demandeAutoFaite && cachePosition === null) {
      demandeAutoFaite = true
      demander()
    }
    // `demander` est stable au sein du montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto])

  return { etat, position, demander }
}
