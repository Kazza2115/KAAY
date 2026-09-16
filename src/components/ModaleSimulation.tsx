import { useEffect, useRef } from 'react'

export interface ContenuSimulation {
  titre: string
  /** Ce que ferait le bouton en production. */
  explication: string
  /** Lien ou message qui serait ouvert/envoyé (affiché, jamais suivi). */
  cible: string | null
}

interface Props {
  contenu: ContenuSimulation | null
  onFermer: () => void
}

/**
 * Les fiches actuelles étant fictives, les actions de contact ne sont pas
 * déclenchées : cette fenêtre montre ce qui se passerait avec une vraie fiche.
 */
export function ModaleSimulation({ contenu, onFermer }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialogue = ref.current
    if (!dialogue) return
    if (contenu && !dialogue.open) dialogue.showModal()
    if (!contenu && dialogue.open) dialogue.close()
  }, [contenu])

  return (
    <dialog
      ref={ref}
      className="modale"
      onClose={onFermer}
      onClick={(e) => {
        // Clic sur le fond assombri : fermer.
        if (e.target === ref.current) ref.current?.close()
      }}
      aria-labelledby="modale-titre"
    >
      {contenu && (
        <div className="modale-corps">
          <p className="modale-etiquette">Action simulée</p>
          <h2 id="modale-titre">{contenu.titre}</h2>
          <p>
            Ce restaurant est une fiche fictive de démonstration : l'action n'est pas
            réellement déclenchée.
          </p>
          <p>{contenu.explication}</p>
          {contenu.cible && <code className="modale-cible">{contenu.cible}</code>}
          <button type="button" className="bouton bouton-principal" onClick={onFermer} autoFocus>
            Compris
          </button>
        </div>
      )}
    </dialog>
  )
}
