import { useState } from 'react'
import type { Restaurant } from '../types'
import { formatTelephone } from '../lib/format'
import { ModaleSimulation, type ContenuSimulation } from './ModaleSimulation'

interface Props {
  restaurant: Restaurant
}

/**
 * Boutons « WhatsApp », « Appeler » et « Itinéraire ».
 *
 * Pour les fiches réelles, chaque bouton ouvrira le lien correspondant.
 * Pour les fiches fictives de démonstration, l'action est simulée : une
 * fenêtre décrit ce qui se passerait, sans contacter personne.
 */
export function ActionsContact({ restaurant }: Props) {
  const [simulation, setSimulation] = useState<ContenuSimulation | null>(null)

  const lienWhatsApp = restaurant.whatsapp
    ? `https://wa.me/${restaurant.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Bonjour ${restaurant.nom}, je vous ai trouvé sur Kaay. Êtes-vous ouverts en ce moment ?`,
      )}`
    : null
  const lienAppel = restaurant.telephone ? `tel:${restaurant.telephone}` : null
  const lienItineraire =
    restaurant.latitude !== null && restaurant.longitude !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`
      : null

  function simuler(contenu: ContenuSimulation) {
    setSimulation(contenu)
  }

  function auClic(e: React.MouseEvent, contenu: ContenuSimulation) {
    if (restaurant.estDemo) {
      e.preventDefault()
      simuler(contenu)
    }
  }

  return (
    <div className="actions-contact">
      {lienWhatsApp ? (
        <a
          className="bouton bouton-whatsapp"
          href={lienWhatsApp}
          onClick={(e) =>
            auClic(e, {
              titre: `Écrire à ${restaurant.nom} sur WhatsApp`,
              explication:
                'En production, WhatsApp s’ouvrirait avec un message prêt à envoyer au restaurant.',
              cible: lienWhatsApp,
            })
          }
        >
          <IconeWhatsApp />
          WhatsApp
        </a>
      ) : (
        <button type="button" className="bouton bouton-whatsapp" disabled title="Numéro WhatsApp non renseigné">
          <IconeWhatsApp />
          WhatsApp
        </button>
      )}
      {lienAppel ? (
        <a
          className="bouton bouton-secondaire"
          href={lienAppel}
          onClick={(e) =>
            auClic(e, {
              titre: `Appeler ${restaurant.nom}`,
              explication: `En production, votre téléphone composerait le ${formatTelephone(
                restaurant.telephone ?? '',
              )}.`,
              cible: lienAppel,
            })
          }
        >
          <IconeTelephone />
          Appeler
        </a>
      ) : (
        <button type="button" className="bouton bouton-secondaire" disabled title="Téléphone non renseigné">
          <IconeTelephone />
          Appeler
        </button>
      )}
      {lienItineraire ? (
        <a
          className="bouton bouton-secondaire"
          href={lienItineraire}
          target="_blank"
          rel="noreferrer"
          onClick={(e) =>
            auClic(e, {
              titre: `Itinéraire vers ${restaurant.nom}`,
              explication:
                'En production, votre application de cartes s’ouvrirait avec le trajet vers le restaurant.',
              cible: lienItineraire,
            })
          }
        >
          <IconeItineraire />
          Itinéraire
        </a>
      ) : (
        <button
          type="button"
          className="bouton bouton-secondaire"
          disabled
          title="Localisation en cours de vérification"
        >
          <IconeItineraire />
          Itinéraire
        </button>
      )}
      <ModaleSimulation contenu={simulation} onFermer={() => setSimulation(null)} />
    </div>
  )
}

function IconeWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3.2-.5 0-.2 0-.4-.1-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7a11 11 0 0 0 4.2 3.7c.6.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.2-.1z" />
    </svg>
  )
}

function IconeTelephone() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
    </svg>
  )
}

function IconeItineraire() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M21.7 11.3l-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4zM14 14.5V12h-3v3H9v-4a1 1 0 0 1 1-1h4V7.5l3.5 3.5-3.5 3.5z" />
    </svg>
  )
}
