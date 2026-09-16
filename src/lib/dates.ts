/**
 * Fraîcheur des informations.
 *
 * Règle du pilote : au-delà de 14 jours sans confirmation, un prix ou des
 * horaires sont marqués « à reconfirmer » et ne servent plus aux filtres
 * correspondants (délai ajustable selon les changements observés).
 */

export const DELAI_FRAICHEUR_JOURS = 14

/** Date ISO (AAAA-MM-JJ) située `n` jours avant aujourd'hui. */
export function ilYAJours(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

/** Nombre de jours entiers écoulés depuis une date ISO, ou `null`. */
export function joursDepuis(dateIso: string | null): number | null {
  if (!dateIso) return null
  const alors = new Date(`${dateIso}T00:00:00Z`).getTime()
  if (Number.isNaN(alors)) return null
  const aujourdHui = new Date()
  const minuitUtc = Date.UTC(
    aujourdHui.getUTCFullYear(),
    aujourdHui.getUTCMonth(),
    aujourdHui.getUTCDate(),
  )
  return Math.max(0, Math.round((minuitUtc - alors) / 86_400_000))
}

/** Vrai si l'information a été confirmée il y a moins de 14 jours. */
export function estRecente(dateIso: string | null): boolean {
  const jours = joursDepuis(dateIso)
  return jours !== null && jours <= DELAI_FRAICHEUR_JOURS
}

/** « aujourd'hui », « hier », « il y a N jours ». */
export function formatDepuis(dateIso: string | null): string | null {
  const jours = joursDepuis(dateIso)
  if (jours === null) return null
  if (jours === 0) return "aujourd'hui"
  if (jours === 1) return 'hier'
  return `il y a ${jours} jours`
}
