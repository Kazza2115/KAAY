import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Jour, Plat, Restaurant } from '../types'
import { fournisseur } from '../data/provider'
import { estRecente, formatDepuis } from '../lib/dates'
import { useMaintenant } from '../lib/useMaintenant'
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
import { BoutonPartager } from '../components/BoutonPartager'
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
  const maintenant = useMaintenant()
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

  // Chaque fiche est une vraie page : titre d'onglet dédié, restauré au départ.
  useEffect(() => {
    if (restaurant) document.title = `${restaurant.nom} — Kaay`
    return () => {
      document.title = 'Kaay — Où manger à Dakar'
    }
  }, [restaurant])

  if (restaurant === null) return <PageIntrouvable />
  if (restaurant === undefined) {
    return (
      <div className="page">
        <p className="chargement" role="status">
          Chargement…
        </p>
      </div>
    )
  }

  const retour = () => {
    // Revenir aux résultats si on vient de l'accueil, sinon y aller.
    const etat = window.history.state as { idx?: number } | null
    if (etat && typeof etat.idx === 'number' && etat.idx > 0) navigate(-1)
    else navigate('/', { viewTransition: true })
  }

  const plats = [...restaurant.plats].sort(
    (a, b) =>
      ORDRE_CATEGORIES[a.categorie] - ORDRE_CATEGORIES[b.categorie] ||
      a.nom.localeCompare(b.nom, 'fr'),
  )
  const jourCourant = jourCourantADakar(maintenant)
  const horairesRecents = estRecente(restaurant.horairesConfirmesLe)
  const services = [
    restaurant.surPlace ? 'Sur place' : null,
    restaurant.aEmporter ? 'À emporter' : null,
  ].filter(Boolean)

  return (
    <div className="page fiche">
      <div className="fiche-barre">
        <button type="button" className="lien-retour" onClick={retour}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Résultats
        </button>
        <BoutonPartager titre={`${restaurant.nom} — Kaay`} />
      </div>

      <div
        className={`galerie ${restaurant.photos.length > 1 ? 'galerie-multiple' : ''}`}
        // Zone défilable : focusable et nommée quand il y a plusieurs photos.
        {...(restaurant.photos.length > 1
          ? { tabIndex: 0, role: 'group', 'aria-label': `Photos de ${restaurant.nom}` }
          : {})}
      >
        {restaurant.photos.length === 0 ? (
          <div
            className="galerie-cadre"
            style={{ viewTransitionName: `photo-${restaurant.slug}` } as React.CSSProperties}
          >
            <PhotoRestaurant photo={null} className="galerie-photo" />
          </div>
        ) : (
          restaurant.photos.map((photo, index) => (
            <div
              key={photo.src}
              className="galerie-cadre"
              // La première photo répond à celle de la carte (View Transitions).
              style={
                index === 0
                  ? ({ viewTransitionName: `photo-${restaurant.slug}` } as React.CSSProperties)
                  : undefined
              }
            >
              <PhotoRestaurant photo={photo} className="galerie-photo" />
            </div>
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
        <StatutOuvertureBadge statut={statutOuverture(restaurant, maintenant)} detaille />
        {restaurant.description && <p className="fiche-description">{restaurant.description}</p>}
        {services.length > 0 && <p className="fiche-services">{services.join(' · ')}</p>}
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
        <p className="note-discrete">Prix en FCFA — disponibilité à confirmer au contact.</p>
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
          <p className="info-manquante">À confirmer auprès du restaurant.</p>
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
          <p className="note-discrete">Localisation à confirmer.</p>
        )}
        {restaurant.telephone && (
          <p className="note-discrete">Téléphone : {formatTelephone(restaurant.telephone)}</p>
        )}
      </section>

      <div className="fiche-pied">
        <LienSignalement restaurant={restaurant} />
        {restaurant.horairesConfirmesLe && horairesRecents && (
          <p className="note-discrete">
            Horaires vérifiés {formatDepuis(restaurant.horairesConfirmesLe)}.
          </p>
        )}
      </div>
    </div>
  )
}
