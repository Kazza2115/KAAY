import type { Criteres } from '../lib/filtres'
import { TRANCHES_BUDGET } from '../lib/filtres'

interface Props {
  criteres: Criteres
  quartiers: string[]
  cuisines: string[]
  onChange: (criteres: Criteres) => void
}

/** Recherche libre et filtres simples : quartier, cuisine, budget, à emporter. */
export function FiltresBar({ criteres, quartiers, cuisines, onChange }: Props) {
  const filtresActifs =
    criteres.recherche !== '' ||
    criteres.quartier !== null ||
    criteres.cuisine !== null ||
    criteres.budget !== null ||
    criteres.aEmporter

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
          placeholder="Un plat, un restaurant, un quartier…"
          aria-label="Rechercher un plat, un restaurant ou un quartier"
          enterKeyHint="search"
        />
      </div>

      <div className="filtres-selects">
        <label className="select-enveloppe">
          <span className="select-etiquette">Quartier</span>
          <select
            value={criteres.quartier ?? ''}
            onChange={(e) => onChange({ ...criteres, quartier: e.target.value || null })}
          >
            <option value="">Tous les quartiers</option>
            {quartiers.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </label>
        <label className="select-enveloppe">
          <span className="select-etiquette">Cuisine</span>
          <select
            value={criteres.cuisine ?? ''}
            onChange={(e) => onChange({ ...criteres, cuisine: e.target.value || null })}
          >
            <option value="">Toutes les cuisines</option>
            {cuisines.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="groupe-budget">
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
    </section>
  )
}
