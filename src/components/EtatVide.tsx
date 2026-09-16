interface Props {
  onEffacerFiltres: () => void
}

/** État affiché quand aucun restaurant ne correspond aux critères. */
export function EtatVide({ onEffacerFiltres }: Props) {
  return (
    <div className="etat-vide">
      <svg viewBox="0 0 96 96" width="72" height="72" aria-hidden="true">
        <circle cx="48" cy="48" r="34" fill="none" stroke="#B9C2C8" strokeWidth="5" />
        <path d="M34 54q14 10 28 0" fill="none" stroke="#B9C2C8" strokeWidth="5" strokeLinecap="round" transform="rotate(180 48 56)" />
        <circle cx="38" cy="42" r="4" fill="#B9C2C8" />
        <circle cx="58" cy="42" r="4" fill="#B9C2C8" />
      </svg>
      <h2>Aucun restaurant</h2>
      <p>Essayez d'élargir vos critères.</p>
      <button type="button" className="bouton bouton-principal" onClick={onEffacerFiltres}>
        Effacer les filtres
      </button>
    </div>
  )
}
