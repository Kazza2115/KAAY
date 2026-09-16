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

/** Mini-illustration colorée par catégorie ; assiette neutre pour les inconnues. */
function IconeCategorie({ nom }: { nom: string }) {
  const commun = { viewBox: '0 0 48 48', width: 34, height: 34, 'aria-hidden': true } as const

  switch (nom) {
    case 'Hamburger':
      return (
        <svg {...commun}>
          <path d="M8 20a16 11 0 0 1 32 0z" fill="#E8A33D" />
          <path d="M8 20a16 11 0 0 1 32 0z" fill="#F2BC5C" transform="translate(0 -1.2) scale(0.98)" transform-origin="24 20" />
          <ellipse cx="17" cy="14.5" rx="1.2" ry="0.8" fill="#FBEBC9" />
          <ellipse cx="24" cy="12.5" rx="1.2" ry="0.8" fill="#FBEBC9" />
          <ellipse cx="31" cy="14.5" rx="1.2" ry="0.8" fill="#FBEBC9" />
          <path d="M7 21h34l-2.5 3.5 -4 -2.5 -4.5 3 -4 -3 -4.5 3 -4 -2.5 -4 2.5 -4 -3z" fill="#7FA84B" />
          <rect x="8" y="25" width="32" height="4.5" rx="2.2" fill="#F2C94C" />
          <rect x="7" y="29.5" width="34" height="6" rx="3" fill="#7C4321" />
          <path d="M8 37a3.5 3.5 0 0 0 3.5 3.5h25A3.5 3.5 0 0 0 40 37v-1.5H8z" fill="#E8A33D" />
        </svg>
      )
    case 'Poulet':
      return (
        <svg {...commun}>
          <path d="M33 8a13 13 0 1 0-18.4 18.4l4.8-1.2 1.6-8z" fill="#C97A3D" transform="rotate(8 24 20)" />
          <path d="M31 10a11 11 0 0 0-14 1.5c3 0 8 1.5 10.5 5z" fill="#DE9455" transform="rotate(8 24 20)" />
          <path d="M15.5 27.5L9 34" stroke="#F4EDE0" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="7.2" cy="36.6" r="3.4" fill="#F4EDE0" />
          <circle cx="11.6" cy="39.4" r="3" fill="#F4EDE0" />
        </svg>
      )
    case 'Viande':
      return (
        <svg {...commun}>
          <path d="M40 21c0-7-6.7-12-16-12S8 14 8 21.7 14.7 35 23 38c9 3.2 17-2.5 17-9z" fill="#C64B3E" />
          <path d="M37 21c0-5.4-5.4-9.5-13-9.5S11 15.3 11 21.3 16.4 32 23 34.4c7.2 2.6 14-1.9 14-7z" fill="#E06A55" />
          <path d="M30 23a7.5 7.5 0 0 0-7.5-7.5" stroke="#F6D8C2" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="30.5" cy="27.5" r="3" fill="#F6D8C2" />
        </svg>
      )
    case 'Poisson':
      return (
        <svg {...commun}>
          <path d="M5 24q9-10.5 19.5-10.5 9 0 17.5 10.5-8.5 10.5-17.5 10.5Q14 34.5 5 24z" fill="#4C96B8" />
          <path d="M8 26q8 6.5 16.5 6.5 7.5 0 14.5-6-7.5 8-14.5 8Q15.5 34.5 8 26z" fill="#3A7E9E" />
          <path d="M42 24l-7-7v14z" fill="#3A7E9E" />
          <circle cx="13.5" cy="22" r="1.8" fill="#0E3140" />
          <path d="M24 15.5q4 3.8 4 8.5t-4 8.5" stroke="#7FB8D2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'Fruits de mer':
      return (
        <svg {...commun}>
          {/* crabe */}
          <g stroke="#D95F33" strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M10 27l-5 2M10.5 31l-4 3.5M12 34.5l-2.5 4.5M38 27l5 2M37.5 31l4 3.5M36 34.5l2.5 4.5" />
          </g>
          <path d="M15 14a5.5 5.5 0 1 1 7 5l-3.5 3-4-4.5zM33 14a5.5 5.5 0 1 0-7 5l3.5 3 4-4.5z" fill="#F07A4B" />
          <circle cx="14.5" cy="12.5" r="3.4" fill="#F5936B" />
          <circle cx="33.5" cy="12.5" r="3.4" fill="#F5936B" />
          <ellipse cx="24" cy="29" rx="14" ry="10.5" fill="#E8603C" />
          <ellipse cx="24" cy="27.5" rx="11.5" ry="8" fill="#F07A4B" />
          <circle cx="19.5" cy="26" r="1.8" fill="#5B1F0C" />
          <circle cx="28.5" cy="26" r="1.8" fill="#5B1F0C" />
          <path d="M20 32q4 2.6 8 0" stroke="#B94A28" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'Végétarien':
      return (
        <svg {...commun}>
          <path d="M24 5C13 12 9 20 9 28a15 15 0 0 0 30 0c0-8-4-16-15-23z" fill="#4E7038" />
          <path d="M24 9c-9 6-12 13-12 19a12 12 0 0 0 24 0c0-6-3-13-12-19z" fill="#A8C86B" />
          <circle cx="24" cy="28" r="6.5" fill="#7C4A2B" />
          <circle cx="22.2" cy="26.2" r="2" fill="#9A6238" />
        </svg>
      )
    default:
      return (
        <svg {...commun}>
          <ellipse cx="24" cy="26" rx="17" ry="13" fill="#DDE3E6" />
          <ellipse cx="24" cy="24.5" rx="17" ry="13" fill="#F2F5F6" />
          <ellipse cx="24" cy="24.5" rx="10" ry="7.5" fill="#DDE3E6" />
        </svg>
      )
  }
}
