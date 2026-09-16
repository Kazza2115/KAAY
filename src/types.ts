/**
 * Modèle de données de Kaay.
 *
 * Les structures reprennent les ensembles prévus pour Supabase
 * (restaurants, plats et prix, horaires, dates de confirmation) afin que
 * la bascule des données de démonstration vers la base réelle se limite
 * à remplacer le fournisseur dans `src/data/provider.ts`.
 */

/** Une photo d'un restaurant ou d'un plat. `src` deviendra une URL Supabase Storage. */
export interface Photo {
  src: string
  alt: string
}

/** Jour de la semaine : 0 = dimanche … 6 = samedi (convention JavaScript). */
export type Jour = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Une plage d'ouverture. Une fermeture après minuit s'écrit ex. "00:30". */
export interface PlageHoraire {
  jour: Jour
  /** Heure d'ouverture "HH:MM", fuseau Africa/Dakar. */
  ouverture: string
  /** Heure de fermeture "HH:MM". Si inférieure à l'ouverture, la plage passe minuit. */
  fermeture: string
}

/** Un plat avec son prix en FCFA et sa date de confirmation. */
export interface Plat {
  id: string
  nom: string
  categorie: 'plat' | 'entree' | 'dessert' | 'boisson'
  /** Prix en FCFA. `null` = prix non renseigné (« à confirmer »). */
  prixFcfa: number | null
  /** Date ISO (AAAA-MM-JJ) de la dernière confirmation du prix, ou `null`. */
  prixConfirmeLe: string | null
}

export interface Restaurant {
  id: string
  /** Identifiant lisible utilisé dans l'URL de la fiche. */
  slug: string
  nom: string
  quartier: string
  /** Types de cuisine, du plus représentatif au moins représentatif. */
  cuisines: string[]
  /** Description courte affichée sur la fiche. */
  description: string | null
  adresse: string | null
  latitude: number | null
  longitude: number | null
  /** Téléphone public au format international, ex. "+221771234567". */
  telephone: string | null
  /** Numéro WhatsApp au format international, ou `null` si non renseigné. */
  whatsapp: string | null
  surPlace: boolean
  aEmporter: boolean
  photos: Photo[]
  /** Plages d'ouverture, ou `null` si les horaires ne sont pas connus. */
  horaires: PlageHoraire[] | null
  /** Date ISO de la dernière confirmation des horaires, ou `null`. */
  horairesConfirmesLe: string | null
  plats: Plat[]
  statut: 'publie' | 'brouillon'
  /** Mis en avant dans la rubrique « Populaires » de l'accueil. */
  populaire: boolean
  /** Vrai pour les fiches fictives de démonstration. */
  estDemo: boolean
}

/** Tranches de budget proposées dans les filtres (bornes en FCFA). */
export interface TrancheBudget {
  id: string
  libelle: string
  min: number
  /** `null` = pas de plafond. */
  max: number | null
}

/** État calculé de l'ouverture d'un restaurant, à l'instant de consultation. */
export type StatutOuverture =
  | { type: 'ouvert'; fermeA: string }
  | { type: 'ferme'; prochaineOuverture: string | null }
  | { type: 'inconnu' }
