import { useState } from 'react'
import type { Restaurant } from '../types'
import { ModaleSimulation, type ContenuSimulation } from './ModaleSimulation'

/** Numéro WhatsApp interne de l'équipe Kaay (à remplacer au lancement). */
const WHATSAPP_EQUIPE = '221700000000'

interface Props {
  restaurant: Restaurant
}

/**
 * « Signaler une information à corriger » : transmet à l'équipe un message
 * qui référence la fiche. Les corrections sont vérifiées avant publication.
 */
export function LienSignalement({ restaurant }: Props) {
  const [simulation, setSimulation] = useState<ContenuSimulation | null>(null)

  const message = `Correction pour la fiche « ${restaurant.nom} » (${restaurant.id}) : `
  const lien = `https://wa.me/${WHATSAPP_EQUIPE}?text=${encodeURIComponent(message)}`

  return (
    <>
      <button
        type="button"
        className="lien-signalement"
        onClick={(e) => {
          if (restaurant.estDemo) {
            e.preventDefault()
            setSimulation({
              titre: 'Signaler une erreur',
              explication:
                "Fiche fictive : en production, WhatsApp s'ouvrirait avec un message adressé à l'équipe Kaay.",
              cible: lien,
            })
          } else {
            window.open(lien, '_blank', 'noreferrer')
          }
        }}
      >
        Signaler une erreur
      </button>
      <ModaleSimulation contenu={simulation} onFermer={() => setSimulation(null)} />
    </>
  )
}
