interface Props {
  /** Catégories réellement présentes dans le catalogue. */
  cuisines: string[]
  selection: string | null
  onSelect: (cuisine: string | null) => void
}

/** Ordre d'affichage préféré ; les catégories inconnues suivent, triées. */
const ORDRE = ['Hamburger', 'Poulet', 'Viande', 'Poisson', 'Fruits de mer', 'Végétarien']

/**
 * Rangée de catégories illustrées, façon Uber Eats : un geste filtre le
 * catalogue par type de plat, un second geste efface le filtre.
 */
export function BarreCategories({ cuisines, selection, onSelect }: Props) {
  const visibles = [
    ...ORDRE.filter((c) => cuisines.includes(c)),
    ...cuisines.filter((c) => !ORDRE.includes(c)).sort((a, b) => a.localeCompare(b, 'fr')),
  ]
  if (visibles.length === 0) return null

  return (
    <ul className="categories" aria-label="Catégories de plats">
      {visibles.map((cuisine) => {
        const active = selection === cuisine
        return (
          <li key={cuisine}>
            <button
              type="button"
              className={`categorie ${active ? 'categorie-active' : ''}`}
              aria-pressed={active}
              onClick={() => onSelect(active ? null : cuisine)}
            >
              <span className="categorie-icone">
                <IconeCategorie nom={cuisine} />
              </span>
              <span className="categorie-nom">{cuisine}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/** Petite icône par catégorie ; un couvert générique pour les inconnues. */
function IconeCategorie({ nom }: { nom: string }) {
  const commun = {
    viewBox: '0 0 32 32',
    width: 26,
    height: 26,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  } as const

  switch (nom) {
    case 'Hamburger':
      return (
        <svg {...commun}>
          <path d="M6 13a10 7.5 0 0 1 20 0z" />
          <path d="M5 17h22M7 21h18" />
          <path d="M6 24a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3" />
          <circle cx="13" cy="9.5" r="0.4" fill="currentColor" />
          <circle cx="19" cy="9.5" r="0.4" fill="currentColor" />
        </svg>
      )
    case 'Poulet':
      return (
        <svg {...commun}>
          <path d="M22.5 9.5a7.6 7.6 0 1 0-10.8 10.8l3-3z" />
          <path d="M11.7 20.3l-4.2 4.2" />
          <circle cx="6" cy="26" r="2.2" />
          <circle cx="9.5" cy="27.5" r="1.6" />
        </svg>
      )
    case 'Viande':
      return (
        <svg {...commun}>
          <path d="M26 14c0-4.4-4.5-8-10-8S5 9.6 5 14.5 9.5 24 15 26c6 2.2 11-1.5 11-6z" />
          <path d="M21 15.5a5 5 0 0 0-5-5" />
          <circle cx="21.5" cy="19.5" r="1.6" />
        </svg>
      )
    case 'Poisson':
      return (
        <svg {...commun}>
          <path d="M4 16q6-7 13-7 6 0 11 7-5 7-11 7-7 0-13-7z" />
          <path d="M28 16l-5-5M28 16l-5 5" transform="translate(-1 0)" />
          <circle cx="10.5" cy="15" r="0.5" fill="currentColor" />
        </svg>
      )
    case 'Fruits de mer':
      return (
        <svg {...commun}>
          <path d="M9 7a9.5 9.5 0 0 1 0 19h7a9.5 9.5 0 0 0 0-19z" />
          <path d="M13 10.5h6M12 16h7.5M13 21.5h6" />
          <circle cx="7.5" cy="10" r="0.5" fill="currentColor" />
        </svg>
      )
    case 'Végétarien':
      return (
        <svg {...commun}>
          <path d="M25 7C13 7 7 13.5 7 25c11.5 0 18-6 18-18z" />
          <path d="M8.5 23.5Q14 18 20 12.5" />
        </svg>
      )
    default:
      return (
        <svg {...commun}>
          <path d="M10 5v9a3 3 0 0 0 6 0V5M13 5v22" />
          <path d="M22 5q-3 6-3 11h3v11" />
        </svg>
      )
  }
}
