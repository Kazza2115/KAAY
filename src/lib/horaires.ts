import type { Jour, PlageHoraire, Restaurant, StatutOuverture } from '../types'
import { estRecente } from './dates'

/**
 * Calcul de l'état d'ouverture, dans le fuseau Africa/Dakar.
 *
 * « Ouvert selon les horaires » n'est affiché que si les horaires sont connus
 * ET confirmés récemment ; sinon l'état est « inconnu » (« À confirmer »).
 */

export const JOURS_COURTS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'] as const
export const JOURS_LONGS = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
] as const

/** Minutes écoulées depuis minuit pour une heure "HH:MM". */
function enMinutes(heure: string): number {
  const [h, m] = heure.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

/** « 12:00 » → « 12 h 00 » pour l'affichage. */
export function formatHeure(heure: string): string {
  const [h, m] = heure.split(':')
  return `${Number(h)} h ${m ?? '00'}`
}

/** Jour de la semaine et minutes courantes, à Dakar (GMT toute l'année). */
function maintenantADakar(reference: Date): { jour: Jour; minutes: number } {
  const parties = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Dakar',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(reference)
  const brut: Record<string, string> = {}
  for (const p of parties) brut[p.type] = p.value
  const indexJour: Record<string, Jour> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  const jour = indexJour[brut.weekday ?? ''] ?? 0
  // `hour12: false` peut produire « 24 » pour minuit selon les moteurs.
  const heures = Number(brut.hour) % 24
  return { jour, minutes: heures * 60 + Number(brut.minute) }
}

/**
 * Une plage couvre-t-elle l'instant donné ? Les plages dont la fermeture est
 * inférieure à l'ouverture (ex. 19:00 → 00:30) passent minuit : elles couvrent
 * la fin du jour indiqué et le début du jour suivant.
 */
function plageCouvre(plage: PlageHoraire, jour: Jour, minutes: number): boolean {
  const debut = enMinutes(plage.ouverture)
  const fin = enMinutes(plage.fermeture)
  if (fin > debut) {
    return plage.jour === jour && minutes >= debut && minutes < fin
  }
  // Plage passant minuit.
  const veille = ((jour + 6) % 7) as Jour
  return (plage.jour === jour && minutes >= debut) || (plage.jour === veille && minutes < fin)
}

/**
 * Prochaine ouverture (texte court) après l'instant donné, ou `null`.
 * `decalage` va jusqu'à 7 inclus pour retomber sur le jour courant de la
 * semaine suivante (restaurant ouvert un seul jour, consulté après l'heure).
 */
function prochaineOuverture(
  plages: PlageHoraire[],
  jour: Jour,
  minutes: number,
): string | null {
  for (let decalage = 0; decalage <= 7; decalage++) {
    const j = ((jour + decalage) % 7) as Jour
    const duJour = plages
      .filter((p) => p.jour === j)
      .sort((a, b) => enMinutes(a.ouverture) - enMinutes(b.ouverture))
    for (const p of duJour) {
      if (decalage === 0 && enMinutes(p.ouverture) <= minutes) continue
      const prefixe =
        decalage === 0 ? "aujourd'hui" : decalage === 1 ? 'demain' : JOURS_COURTS[j]
      return `${prefixe} à ${formatHeure(p.ouverture)}`
    }
  }
  return null
}

/**
 * État d'ouverture d'un restaurant. `reference` permet de tester ;
 * par défaut, l'instant courant.
 */
export function statutOuverture(
  restaurant: Pick<Restaurant, 'horaires' | 'horairesConfirmesLe'>,
  reference: Date = new Date(),
): StatutOuverture {
  const { horaires, horairesConfirmesLe } = restaurant
  if (!horaires || horaires.length === 0 || !estRecente(horairesConfirmesLe)) {
    return { type: 'inconnu' }
  }
  const { jour, minutes } = maintenantADakar(reference)
  const plageActive = horaires.find((p) => plageCouvre(p, jour, minutes))
  if (plageActive) {
    return { type: 'ouvert', fermeA: formatHeure(plageActive.fermeture) }
  }
  return { type: 'ferme', prochaineOuverture: prochaineOuverture(horaires, jour, minutes) }
}

/** Regroupe les plages par jour pour le tableau des horaires de la fiche. */
export function plagesParJour(horaires: PlageHoraire[]): Map<Jour, PlageHoraire[]> {
  const parJour = new Map<Jour, PlageHoraire[]>()
  for (const plage of horaires) {
    const liste = parJour.get(plage.jour) ?? []
    liste.push(plage)
    parJour.set(plage.jour, liste)
  }
  for (const liste of parJour.values()) {
    liste.sort((a, b) => enMinutes(a.ouverture) - enMinutes(b.ouverture))
  }
  return parJour
}

/** Jour courant à Dakar, pour surligner la ligne du tableau des horaires. */
export function jourCourantADakar(reference: Date = new Date()): Jour {
  return maintenantADakar(reference).jour
}
