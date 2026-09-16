import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Restaurant } from '../types'
import { fournisseur } from '../data/provider'
import {
  CRITERES_VIDES,
  type Criteres,
  type Tri,
  TRANCHES_BUDGET,
  cuisinesDisponibles,
  filtrerRestaurants,
  quartiersDisponibles,
} from '../lib/filtres'
import { useMaintenant } from '../lib/useMaintenant'
import { FiltresBar } from '../components/FiltresBar'
import { RestaurantCard } from '../components/RestaurantCard'
import { EtatVide } from '../components/EtatVide'

/**
 * Dernière liste chargée, conservée au niveau du module : au retour depuis
 * une fiche, la grille se ré-affiche immédiatement (et la position de
 * défilement se restaure) même quand le fournisseur passera par le réseau.
 */
let cacheRestaurants: Restaurant[] | null = null

/**
 * Accueil : recherche, filtres et liste des résultats.
 * Les critères vivent dans l'URL pour survivre au retour depuis une fiche.
 * Le texte de recherche est doublé dans un état local : React Router met à
 * jour l'URL dans une transition, ce qui ne convient pas à un champ contrôlé.
 */
export function Accueil() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(() => cacheRestaurants)
  const [parametres, setParametres] = useSearchParams()
  const [texteRecherche, setTexteRecherche] = useState(() => parametres.get('q') ?? '')
  const maintenant = useMaintenant()

  useEffect(() => {
    let actif = true
    fournisseur.listerRestaurants().then((liste) => {
      cacheRestaurants = liste
      if (actif) setRestaurants(liste)
    })
    return () => {
      actif = false
    }
  }, [])

  // Recopie différée du texte de recherche vers l'URL (persistance seulement :
  // le filtrage se fait sur l'état local, sans attendre).
  useEffect(() => {
    const minuterie = setTimeout(() => {
      setParametres(
        (precedents) => {
          const p = new URLSearchParams(precedents)
          if (texteRecherche) p.set('q', texteRecherche)
          else p.delete('q')
          return p
        },
        { replace: true },
      )
    }, 250)
    return () => clearTimeout(minuterie)
  }, [texteRecherche, setParametres])

  const criteres: Criteres = useMemo(
    () => ({
      recherche: texteRecherche,
      quartier: parametres.get('quartier'),
      cuisine: parametres.get('cuisine'),
      budget: TRANCHES_BUDGET.find((t) => t.id === parametres.get('budget')) ?? null,
      aEmporter: parametres.get('emporter') === '1',
    }),
    [parametres, texteRecherche],
  )
  const tri: Tri = parametres.get('tri') === 'alphabetique' ? 'alphabetique' : 'pertinence'

  function majCriteres(suivants: Criteres) {
    if (suivants.recherche !== texteRecherche) setTexteRecherche(suivants.recherche)
    setParametres(
      (precedents) => {
        const p = new URLSearchParams(precedents)
        const poser = (cle: string, valeur: string | null) => {
          if (valeur) p.set(cle, valeur)
          else p.delete(cle)
        }
        poser('q', suivants.recherche || null)
        poser('quartier', suivants.quartier)
        poser('cuisine', suivants.cuisine)
        poser('budget', suivants.budget?.id ?? null)
        poser('emporter', suivants.aEmporter ? '1' : null)
        return p
      },
      { replace: true },
    )
  }

  function majTri(suivant: Tri) {
    setParametres(
      (precedents) => {
        const p = new URLSearchParams(precedents)
        if (suivant === 'alphabetique') p.set('tri', suivant)
        else p.delete('tri')
        return p
      },
      { replace: true },
    )
  }

  const resultats = useMemo(
    () => (restaurants ? filtrerRestaurants(restaurants, criteres, tri) : []),
    [restaurants, criteres, tri],
  )

  return (
    <div className="page">
      <h1 className="sr-only">Kaay — où manger à Dakar</h1>

      <FiltresBar
        criteres={criteres}
        quartiers={restaurants ? quartiersDisponibles(restaurants) : []}
        cuisines={restaurants ? cuisinesDisponibles(restaurants) : []}
        onChange={majCriteres}
      />

      {/* Région live permanente : annonce le décompte aux lecteurs d'écran. */}
      <p className="sr-only" role="status">
        {restaurants === null
          ? 'Chargement des restaurants'
          : `${resultats.length} restaurant${resultats.length > 1 ? 's' : ''} trouvé${
              resultats.length > 1 ? 's' : ''
            }`}
      </p>

      {restaurants === null ? (
        <ul className="grille-cartes" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="carte carte-squelette" style={{ '--index': i } as React.CSSProperties}>
              <div className="squelette squelette-photo" />
              <div className="carte-corps">
                <div className="squelette squelette-ligne" style={{ width: '55%' }} />
                <div className="squelette squelette-ligne" style={{ width: '75%' }} />
              </div>
            </li>
          ))}
        </ul>
      ) : resultats.length === 0 ? (
        <EtatVide onEffacerFiltres={() => majCriteres(CRITERES_VIDES)} />
      ) : (
        <section aria-label="Résultats">
          <div className="resultats-entete">
            <h2 className="resultats-compte">
              {resultats.length} restaurant{resultats.length > 1 ? 's' : ''}
            </h2>
            <label className="tri">
              <select
                aria-label="Trier les résultats"
                value={tri}
                onChange={(e) => majTri(e.target.value as Tri)}
              >
                <option value="pertinence">Pertinence</option>
                <option value="alphabetique">Nom A–Z</option>
              </select>
            </label>
          </div>
          <ul className="grille-cartes">
            {resultats.map((r, index) => (
              <RestaurantCard key={r.id} restaurant={r} maintenant={maintenant} index={index} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
