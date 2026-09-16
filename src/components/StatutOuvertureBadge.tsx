import type { StatutOuverture } from '../types'

interface Props {
  statut: StatutOuverture
  /** Version détaillée pour la fiche (heure de fermeture ou de réouverture). */
  detaille?: boolean
}

/**
 * Pastille d'état d'ouverture. « Ouvert selon les horaires » n'apparaît que
 * lorsque les horaires sont connus et confirmés récemment.
 */
export function StatutOuvertureBadge({ statut, detaille = false }: Props) {
  if (statut.type === 'ouvert') {
    // La nuance « selon les horaires confirmés » reste portée par
    // l'infobulle et les lecteurs d'écran : l'ouverture est déclarative.
    return (
      <span
        className="statut statut-ouvert"
        title="Ouvert selon les horaires confirmés"
        aria-label={`Ouvert selon les horaires confirmés${detaille ? `, jusqu'à ${statut.fermeA}` : ''}`}
      >
        <span className="statut-point" aria-hidden="true" />
        {detaille ? `Ouvert · jusqu'à ${statut.fermeA}` : 'Ouvert'}
      </span>
    )
  }
  if (statut.type === 'ferme') {
    return (
      <span
        className="statut statut-ferme"
        {...(detaille ? {} : { title: 'Fermé selon les horaires confirmés', 'aria-label': 'Fermé selon les horaires confirmés' })}
      >
        <span className="statut-point" aria-hidden="true" />
        {detaille && statut.prochaineOuverture
          ? `Fermé · ouvre ${statut.prochaineOuverture}`
          : 'Fermé'}
      </span>
    )
  }
  return <span className="statut statut-inconnu">Horaires à confirmer</span>
}
