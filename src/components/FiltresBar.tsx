import { useState } from 'react'
import type { Criteres } from '../lib/filtres'
import { TRANCHES_BUDGET } from '../lib/filtres'

interface Props {
  criteres: Criteres
  quartiers: string[]
  cuisines: string[]
  onChange: (criteres: Criteres) => void
}

/**
 * Recherche et filtres. Au premier plan : recherche, quartier, cuisine.
 * Le budget et « à emporter » se replient derrière le bouton réglages.
 */
export function FiltresBar({ criteres, quartiers, cuisines, onChange }: Props) {
  const nbFiltresReplies = (criteres.budget ? 1 : 0) + (criteres.aEmporter ? 1 : 0)
  // Ouvert d'emblée si l'URL contient déjà un filtre replié.
  const [panneauOuvert, setPanneauOuvert] = useState(nbFiltresReplies > 0)

  const filtresActifs =
    criteres.recherche !== '' ||
    criteres.quartier !== null ||
    criteres.cuisine !== null ||
    nbFiltresReplies > 0

  return (
    <section className="filtres" aria-label="Recherche et filtres">
      <div className="champ-recherche">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="champ-recherche-icone">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={criteres.recherche}
          onChange={(e) => onChange({ ...criteres, recherche: e.target.value })}
          placeholder="Plat, restaurant, quartier…"
          aria-label="Rechercher un plat, un restaurant ou un quartier"
          enterKeyHint="search"
        />
      </div>

      <div className="filtres-ligne">
        <select
          aria-label="Quartier"
          value={criteres.quartier ?? ''}
          onChange={(e) => onChange({ ...criteres, quartier: e.target.value || null })}
        >
          <option value="">Quartier</option>
          {quartiers.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
        <select
          aria-label="Cuisine"
          value={criteres.cuisine ?? ''}
          onChange={(e) => onChange({ ...criteres, cuisine: e.target.value || null })}
        >
          <option value="">Cuisine</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={`bouton-filtres ${panneauOuvert || nbFiltresReplies > 0 ? 'bouton-filtres-actif' : ''}`}
          aria-label="Plus de filtres"
          aria-expanded={panneauOuvert}
          onClick={() => setPanneauOuvert((o) => !o)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M4 7h16M8 12h12M12 17h8" />
            <circle cx="6" cy="12" r="2" fill="currentColor" stroke="none" />
            <circle cx="10" cy="17" r="2" fill="currentColor" stroke="none" />
            <circle cx="16" cy="7" r="2" fill="currentColor" stroke="none" />
          </svg>
          {nbFiltresReplies > 0 && <span className="filtres-badge">{nbFiltresReplies}</span>}
        </button>
      </div>

      {panneauOuvert && (
        <div className="panneau-filtres">
          <span className="select-etiquette" id="etiquette-budget">
            Budget par plat (FCFA)
          </span>
          <div className="filtres-chips" role="group" aria-labelledby="etiquette-budget">
            {TRANCHES_BUDGET.map((tranche) => {
              const active = criteres.budget?.id === tranche.id
              return (
                <button
                  key={tranche.id}
                  type="button"
                  className={`chip ${active ? 'chip-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => onChange({ ...criteres, budget: active ? null : tranche })}
                >
                  {tranche.libelle}
                </button>
              )
            })}
          </div>
          <div className="filtres-chips">
            <button
              type="button"
              className={`chip ${criteres.aEmporter ? 'chip-active' : ''}`}
              aria-pressed={criteres.aEmporter}
              onClick={() => onChange({ ...criteres, aEmporter: !criteres.aEmporter })}
            >
              À emporter
            </button>
            {filtresActifs && (
              <button
                type="button"
                className="chip chip-effacer"
                onClick={() =>
                  onChange({ recherche: '', quartier: null, cuisine: null, budget: null, aEmporter: false })
                }
              >
                Tout effacer
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
