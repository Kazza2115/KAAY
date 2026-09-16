import { useEffect, useRef, useState } from 'react'

interface Props {
  /** Titre proposé à la feuille de partage. */
  titre: string
}

/**
 * Partage l'adresse de la page courante : feuille de partage native sur
 * mobile, sinon copie du lien avec un retour visuel bref.
 */
export function BoutonPartager({ titre }: Props) {
  const [copie, setCopie] = useState(false)
  const minuterie = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(minuterie.current), [])

  async function partager() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: titre, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopie(true)
        clearTimeout(minuterie.current)
        minuterie.current = setTimeout(() => setCopie(false), 2000)
      }
    } catch {
      // Partage annulé par la personne : rien à faire.
    }
  }

  return (
    <button type="button" className="lien-retour bouton-partager" onClick={partager}>
      <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="12" r="2.6" />
        <circle cx="17.5" cy="5.5" r="2.6" />
        <circle cx="17.5" cy="18.5" r="2.6" />
        <path d="M8.3 10.8l6.9-4M8.3 13.2l6.9 4" />
      </svg>
      {copie ? 'Lien copié' : 'Partager'}
    </button>
  )
}
