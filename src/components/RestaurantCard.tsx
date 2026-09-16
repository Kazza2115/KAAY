import { Link } from 'react-router-dom'
import type { Restaurant } from '../types'
import { estRecente, formatDepuis } from '../lib/dates'
import { platRepresentatif } from '../lib/filtres'
import { formatFcfa } from '../lib/format'
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
}

/** Carte de résultat : photo, nom, quartier, cuisine et prix d'un plat. */
export function RestaurantCard({ restaurant, maintenant, index }: Props) {
  const plat = platRepresentatif(restaurant)
  const prixFiable = plat !== null && estRecente(plat.prixConfirmeLe)

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
          {plat && plat.prixFcfa !== null ? (
            <p className="carte-prix">
              <span className="carte-plat">{plat.nom}</span>
              <span className="carte-montant">{formatFcfa(plat.prixFcfa)}</span>
            </p>
          ) : (
            <p className="carte-prix carte-prix-absent">Prix à confirmer</p>
          )}
          {plat && plat.prixFcfa !== null && (
            <p className={`carte-fraicheur ${prixFiable ? '' : 'carte-fraicheur-perimee'}`}>
              {prixFiable ? `Vérifié ${formatDepuis(plat.prixConfirmeLe) ?? ''}` : 'À reconfirmer'}
            </p>
          )}
        </div>
      </Link>
    </li>
  )
}
