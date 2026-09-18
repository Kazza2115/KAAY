import type { Plat, Restaurant, TrancheBudget } from '../types'
import { estRecente } from './dates'
import { type PointGeo, distanceKm } from './distance'
import { normaliser } from './format'

/** Recherche et filtres de l'accueil : quartier, cuisine, budget, à emporter. */

// Les bornes sont inclusives : les libellés l'assument (un plat à 2 500 F
// relève à la fois de « Jusqu'à 2 500 F » et de « 2 500 à 5 000 F »).
export const TRANCHES_BUDGET: TrancheBudget[] = [
  { id: 'petit', libelle: "Jusqu'à 2 500 F", min: 0, max: 2500 },
  { id: 'moyen', libelle: '2 500 à 5 000 F', min: 2500, max: 5000 },
  { id: 'confort', libelle: '5 000 F et plus', min: 5000, max: null },
]

export interface Criteres {
  recherche: string
  quartier: string | null
  cuisine: string | null
  budget: TrancheBudget | null
  aEmporter: boolean
}

export const CRITERES_VIDES: Criteres = {
  recherche: '',
  quartier: null,
  cuisine: null,
  budget: null,
  aEmporter: false,
}

/**
 * Prix des plats principaux confirmés récemment — seuls ceux-ci servent au
 * filtre budget (une boisson à 500 F ne rend pas un restaurant « petit prix »).
 */
function prixFiables(plats: Plat[]): number[] {
  return plats
    .filter(
      (p) => p.categorie === 'plat' && p.prixFcfa !== null && estRecente(p.prixConfirmeLe),
    )
    .map((p) => p.prixFcfa as number)
}

/** Au moins un plat au prix fiable dans la tranche demandée. */
function correspondBudget(restaurant: Restaurant, tranche: TrancheBudget): boolean {
  return prixFiables(restaurant.plats).some(
    (prix) => prix >= tranche.min && (tranche.max === null || prix <= tranche.max),
  )
}

/**
 * Score de pertinence pour la recherche libre : nom > plat > cuisine > quartier.
 * Retourne 0 si le texte ne correspond à rien.
 */
function scoreRecherche(restaurant: Restaurant, texte: string): number {
  const requete = normaliser(texte)
  if (!requete) return 1
  let score = 0
  if (normaliser(restaurant.nom).includes(requete)) score += 8
  if (restaurant.plats.some((p) => normaliser(p.nom).includes(requete))) score += 4
  if (restaurant.cuisines.some((c) => normaliser(c).includes(requete))) score += 3
  if (normaliser(restaurant.quartier).includes(requete)) score += 2
  return score
}

export type Tri = 'pertinence' | 'alphabetique' | 'distance'

/** Distance personne → restaurant, ou `null` si la fiche n'est pas localisée. */
export function distanceVers(restaurant: Restaurant, position: PointGeo): number | null {
  if (restaurant.latitude === null || restaurant.longitude === null) return null
  return distanceKm(position, { lat: restaurant.latitude, lng: restaurant.longitude })
}

/**
 * Applique recherche, filtres et tri. Ne retient que les fiches publiées.
 * Le tri « distance » requiert `position` ; les fiches non localisées
 * passent en fin de liste.
 */
export function filtrerRestaurants(
  restaurants: Restaurant[],
  criteres: Criteres,
  tri: Tri = 'pertinence',
  position: PointGeo | null = null,
): Restaurant[] {
  const scores = new Map<string, number>()
  const retenus = restaurants.filter((r) => {
    if (r.statut !== 'publie') return false
    if (criteres.quartier && r.quartier !== criteres.quartier) return false
    if (criteres.cuisine && !r.cuisines.includes(criteres.cuisine)) return false
    if (criteres.aEmporter && !r.aEmporter) return false
    if (criteres.budget && !correspondBudget(r, criteres.budget)) return false
    const score = scoreRecherche(r, criteres.recherche)
    if (score === 0) return false
    scores.set(r.id, score)
    return true
  })
  const parNom = (a: Restaurant, b: Restaurant) => a.nom.localeCompare(b.nom, 'fr')
  if (tri === 'alphabetique') return retenus.sort(parNom)
  if (tri === 'distance' && position) {
    return retenus.sort((a, b) => {
      const da = distanceVers(a, position)
      const db = distanceVers(b, position)
      if (da === null && db === null) return parNom(a, b)
      if (da === null) return 1
      if (db === null) return -1
      return da - db
    })
  }
  return retenus.sort(
    (a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) || parNom(a, b),
  )
}

/** Seules les fiches publiées alimentent les résultats et les filtres. */
function publies(restaurants: Restaurant[]): Restaurant[] {
  return restaurants.filter((r) => r.statut === 'publie')
}

/** Valeurs distinctes pour alimenter les listes de filtres. */
export function quartiersDisponibles(restaurants: Restaurant[]): string[] {
  return [...new Set(publies(restaurants).map((r) => r.quartier))].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  )
}

export function cuisinesDisponibles(restaurants: Restaurant[]): string[] {
  return [...new Set(publies(restaurants).flatMap((r) => r.cuisines))].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  )
}

/**
 * Plat représentatif d'une carte de résultat : le plat principal au prix
 * fiable le moins cher, sinon le premier plat principal renseigné (prix
 * éventuellement à reconfirmer), sinon le premier prix connu, sinon `null`.
 */
export function platRepresentatif(restaurant: Restaurant): Plat | null {
  const principaux = restaurant.plats.filter(
    (p) => p.categorie === 'plat' && p.prixFcfa !== null,
  )
  const fiables = principaux
    .filter((p) => estRecente(p.prixConfirmeLe))
    .sort((a, b) => (a.prixFcfa ?? 0) - (b.prixFcfa ?? 0))
  if (fiables.length > 0) return fiables[0]
  return principaux[0] ?? restaurant.plats.find((p) => p.prixFcfa !== null) ?? null
}
