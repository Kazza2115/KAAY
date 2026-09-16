import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Jour, Plat, Restaurant } from '../types'
import { fournisseur } from '../data/provider'
import { estRecente, formatDepuis } from '../lib/dates'
import { formatFcfa, formatTelephone } from '../lib/format'
import {
  JOURS_LONGS,
  formatHeure,
  jourCourantADakar,
  plagesParJour,
  statutOuverture,
} from '../lib/horaires'
import { ActionsContact } from '../components/ActionsContact'
import { BadgeDemo } from '../components/BadgeDemo'
import { LienSignalement } from '../components/LienSignalement'
import { PhotoRestaurant } from '../components/PhotoRestaurant'
import { StatutOuvertureBadge } from '../components/StatutOuvertureBadge'
import { PageIntrouvable } from './PageIntrouvable'

const ORDRE_CATEGORIES: Record<Plat['categorie'], number> = {
  entree: 0,
  plat: 1,
  dessert: 2,
  boisson: 3,
}
const NOMS_CATEGORIES: Record<Plat['categorie'], string> = {
  entree: 'Entrée',
  plat: 'Plat',
  dessert: 'Dessert',
  boisson: 'Boisson',
}

/** Fiche restaurant : photos, description, plats et prix, horaires, contact. */
export function FicheRestaurant() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  // `restaurant` vaut `undefined` pendant le chargement, `null` si introuvable.
  const [charge, setCharge] = useState<{ slug: string; restaurant: Restaurant | null }>()

  useEffect(() => {
    let actif = true
    fournisseur.trouverParSlug(slug ?? '').then((r) => {
      if (actif) setCharge({ slug: slug ?? '', restaurant: r })
    })
    return () => {
      actif = false
    }
  }, [slug])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const restaurant = charge?.slug === (slug ?? '') ? charge.restaurant : undefined

  if (restaurant === null) return <PageIntrouvable />
  if (restaurant === undefined) {
    return (
      <div className="page">
        <p className="chargement" role="status">
          Chargement de la fiche…
        </p>
      </div>
    )
  }

  const retour = () => {
    // Revenir aux résultats si on vient de l'accueil, sinon y aller.
    const etat = window.history.state as { idx?: number } | null
    if (etat && typeof etat.idx === 'number' && etat.idx > 0) navigate(-1)
    else navigate('/')
  }

  const plats = [...restaurant.plats].sort(
    (a, b) =>
      ORDRE_CATEGORIES[a.categorie] - ORDRE_CATEGORIES[b.categorie] ||
      a.nom.localeCompare(b.nom, 'fr'),
  )
  const jourCourant = jourCourantADakar()
  const horairesRecents = estRecente(restaurant.horairesConfirmesLe)

  return (
    <div className="page fiche">
      <button type="button" className="lien-retour" onClick={retour}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Résultats
      </button>

      <div className={`galerie ${restaurant.photos.length > 1 ? 'galerie-multiple' : ''}`}>
        {restaurant.photos.length === 0 ? (
          <PhotoRestaurant photo={null} className="galerie-photo" />
        ) : (
          restaurant.photos.map((photo) => (
            <PhotoRestaurant key={photo.src} photo={photo} className="galerie-photo" />
          ))
        )}
      </div>

      <div className="fiche-entete">
        <h1>
          {restaurant.nom}
          {restaurant.estDemo && <BadgeDemo />}
        </h1>
        <p className="fiche-sous-titre">
          {restaurant.quartier} · {restaurant.cuisines.join(', ')}
        </p>
        <StatutOuvertureBadge statut={statutOuverture(restaurant)} detaille />
        {restaurant.description && <p className="fiche-description">{restaurant.description}</p>}
        <p className="fiche-services">
          {[
            restaurant.surPlace ? 'Sur place' : null,
            restaurant.aEmporter ? 'À emporter' : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      <ActionsContact restaurant={restaurant} />

      <section className="fiche-section" aria-labelledby="titre-plats">
        <h2 id="titre-plats">Plats et prix</h2>
        <ul className="liste-plats">
          {plats.map((plat) => (
            <li key={plat.id} className="ligne-plat">
              <div>
                <span className="plat-nom">{plat.nom}</span>
                <span className="plat-categorie">{NOMS_CATEGORIES[plat.categorie]}</span>
              </div>
              <div className="plat-prix">
                {plat.prixFcfa === null ? (
                  <span className="etiquette-confirmer">Prix à confirmer</span>
                ) : (
                  <>
                    <span className="plat-montant">{formatFcfa(plat.prixFcfa)}</span>
                    {estRecente(plat.prixConfirmeLe) ? (
                      <span className="plat-verifie">
                        vérifié {formatDepuis(plat.prixConfirmeLe)}
                      </span>
                    ) : (
                      <span className="etiquette-confirmer">À reconfirmer</span>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="note-discrete">
          Prix en FCFA, relevés sur place. La disponibilité des plats se confirme au
          moment du contact.
        </p>
      </section>

      <section className="fiche-section" aria-labelledby="titre-horaires">
        <h2 id="titre-horaires">Horaires</h2>
        {restaurant.horaires && restaurant.horaires.length > 0 ? (
          <>
            <table className="table-horaires">
              <tbody>
                {([1, 2, 3, 4, 5, 6, 0] as Jour[]).map((jour) => {
                  const plages = plagesParJour(restaurant.horaires ?? []).get(jour)
                  return (
                    <tr key={jour} className={jour === jourCourant ? 'jour-courant' : ''}>
                      <th scope="row">{JOURS_LONGS[jour]}</th>
                      <td>
                        {plages
                          ? plages
                              .map(
                                (p) =>
                                  `${formatHeure(p.ouverture)} – ${formatHeure(p.fermeture)}`,
                              )
                              .join(' / ')
                          : 'Fermé'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!horairesRecents && (
              <p className="etiquette-confirmer">
                Horaires à reconfirmer — dernière vérification trop ancienne.
              </p>
            )}
          </>
        ) : (
          <p className="info-manquante">
            Horaires à confirmer directement auprès du restaurant
            {restaurant.telephone ? ` au ${formatTelephone(restaurant.telephone)}` : ''}.
          </p>
        )}
      </section>

      <section className="fiche-section" aria-labelledby="titre-adresse">
        <h2 id="titre-adresse">Adresse</h2>
        {restaurant.adresse ? (
          <p>{restaurant.adresse}</p>
        ) : (
          <p className="info-manquante">Adresse à confirmer.</p>
        )}
        {restaurant.latitude === null && (
          <p className="note-discrete">
            Localisation en cours de vérification par l'équipe — l'itinéraire sera
            disponible ensuite.
          </p>
        )}
        {restaurant.telephone && (
          <p className="note-discrete">Téléphone : {formatTelephone(restaurant.telephone)}</p>
        )}
      </section>

      <div className="fiche-pied">
        <LienSignalement restaurant={restaurant} />
        {restaurant.horairesConfirmesLe && horairesRecents && (
          <p className="note-discrete">
            Horaires confirmés {formatDepuis(restaurant.horairesConfirmesLe)} par l'équipe
            Kaay.
          </p>
        )}
      </div>
    </div>
  )
}
