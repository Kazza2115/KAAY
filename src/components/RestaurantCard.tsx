import { Link } from 'react-router-dom'
import type { Restaurant } from '../types'
import { formatDistance } from '../lib/distance'
import { statutOuverture } from '../lib/horaires'
import { BadgeDemo } from './BadgeDemo'
import { PhotoRestaurant } from './PhotoRestaurant'
import { StatutOuvertureBadge } from './StatutOuvertureBadge'

interface Props {
  restaurant: Restaurant
  /** Instant de référence pour l'état ouvert/fermé (rafraîchi par l'appelant). */
  maintenant: Date
  /** Position dans la liste, pour l'apparition en cascade. */
  index: number
  /**
   * Distance en km jusqu'au restaurant : `undefined` tant que la position
   * de la personne est inconnue, `null` si la fiche n'est pas localisée.
   */
  distance?: number | null
}

/** Carte de résultat : photo, nom, quartier, cuisine et distance. */
export function RestaurantCard({ restaurant, maintenant, index, distance }: Props) {
  return (
    <li className="carte" style={{ '--index': Math.min(index, 8) } as React.CSSProperties}>
      <Link
        to={`/restaurant/${restaurant.slug}`}
        className="carte-lien"
        viewTransition
        // Le nom de transition est posé au clic : un restaurant peut figurer
        // dans plusieurs rubriques, et un nom dupliqué annulerait l'effet.
        onClick={(e) => {
          const photo = e.currentTarget.querySelector<HTMLElement>('.carte-photo')
          if (photo) photo.style.viewTransitionName = `photo-${restaurant.slug}`
        }}
      >
        <div className="carte-photo">
          <PhotoRestaurant photo={restaurant.photos[0] ?? null} className="carte-image" />
          {restaurant.estDemo && <BadgeDemo />}
        </div>
        <div className="carte-corps">
          <div className="carte-entete">
            <h3 className="carte-nom">{restaurant.nom}</h3>
            <StatutOuvertureBadge statut={statutOuverture(restaurant, maintenant)} />
          </div>
          <p className="carte-sous-titre">
            {/* Deux types au plus sur la carte ; la fiche liste tout. */}
            {restaurant.quartier} · {restaurant.cuisines.slice(0, 2).join(', ')}
            {restaurant.aEmporter && <span className="carte-emporter"> · À emporter</span>}
          </p>
          {distance !== undefined && (
            <p className="carte-distance">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="currentColor">
                <path d="M12 2a7.5 7.5 0 0 0-7.5 7.5C4.5 14 8 18.5 12 22c4-3.5 7.5-8 7.5-12.5A7.5 7.5 0 0 0 12 2zm0 10.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z" />
              </svg>
              {distance === null ? 'Localisation à confirmer' : `à ${formatDistance(distance)}`}
            </p>
          )}
        </div>
      </Link>
    </li>
  )
}
