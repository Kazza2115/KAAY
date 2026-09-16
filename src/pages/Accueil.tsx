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
import { FiltresBar } from '../components/FiltresBar'
import { RestaurantCard } from '../components/RestaurantCard'
import { EtatVide } from '../components/EtatVide'

/**
 * Accueil : recherche, filtres et liste des résultats.
 * Les critères vivent dans l'URL pour survivre au retour depuis une fiche.
 */
export function Accueil() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null)
  const [parametres, setParametres] = useSearchParams()

  useEffect(() => {
    let actif = true
    fournisseur.listerRestaurants().then((liste) => {
      if (actif) setRestaurants(liste)
    })
    return () => {
      actif = false
    }
  }, [])

  const criteres: Criteres = useMemo(
    () => ({
      recherche: parametres.get('q') ?? '',
      quartier: parametres.get('quartier'),
      cuisine: parametres.get('cuisine'),
      budget: TRANCHES_BUDGET.find((t) => t.id === parametres.get('budget')) ?? null,
      aEmporter: parametres.get('emporter') === '1',
    }),
    [parametres],
  )
  const tri: Tri = parametres.get('tri') === 'alphabetique' ? 'alphabetique' : 'pertinence'

  function majCriteres(suivants: Criteres) {
    const p = new URLSearchParams(parametres)
    const poser = (cle: string, valeur: string | null) => {
      if (valeur) p.set(cle, valeur)
      else p.delete(cle)
    }
    poser('q', suivants.recherche || null)
    poser('quartier', suivants.quartier)
    poser('cuisine', suivants.cuisine)
    poser('budget', suivants.budget?.id ?? null)
    poser('emporter', suivants.aEmporter ? '1' : null)
    setParametres(p, { replace: true })
  }

  function majTri(suivant: Tri) {
    const p = new URLSearchParams(parametres)
    if (suivant === 'alphabetique') p.set('tri', suivant)
    else p.delete('tri')
    setParametres(p, { replace: true })
  }

  const resultats = useMemo(
    () => (restaurants ? filtrerRestaurants(restaurants, criteres, tri) : []),
    [restaurants, criteres, tri],
  )

  return (
    <div className="page">
      <section className="accroche">
        <h1>Trouvez où manger à Dakar</h1>
        <p>
          Par quartier, par envie et par budget — puis contactez directement le
          restaurant.
        </p>
      </section>

      <FiltresBar
        criteres={criteres}
        quartiers={restaurants ? quartiersDisponibles(restaurants) : []}
        cuisines={restaurants ? cuisinesDisponibles(restaurants) : []}
        onChange={majCriteres}
      />

      {restaurants === null ? (
        <p className="chargement" role="status">
          Chargement des restaurants…
        </p>
      ) : resultats.length === 0 ? (
        <EtatVide onEffacerFiltres={() => majCriteres(CRITERES_VIDES)} />
      ) : (
        <section aria-label="Résultats">
          <div className="resultats-entete">
            <h2 className="resultats-compte">
              {resultats.length} restaurant{resultats.length > 1 ? 's' : ''}
            </h2>
            <label className="tri">
              <span>Trier</span>
              <select value={tri} onChange={(e) => majTri(e.target.value as Tri)}>
                <option value="pertinence">Pertinence</option>
                <option value="alphabetique">Nom A–Z</option>
              </select>
            </label>
          </div>
          <ul className="grille-cartes">
            {resultats.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
