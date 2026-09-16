import { useEffect, useState } from 'react'

/**
 * Instant courant, rafraîchi chaque minute et au retour sur l'onglet,
 * pour que les badges « Ouvert / Fermé » ne restent pas figés.
 */
export function useMaintenant(intervalleMs = 60_000): Date {
  const [maintenant, setMaintenant] = useState(() => new Date())

  useEffect(() => {
    const maj = () => setMaintenant(new Date())
    const id = setInterval(maj, intervalleMs)
    document.addEventListener('visibilitychange', maj)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', maj)
    }
  }, [intervalleMs])

  return maintenant
}
