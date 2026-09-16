import type { Restaurant } from '../types'
import { RESTAURANTS_DEMO } from './demo/restaurants'

/**
 * Fournisseur de données.
 *
 * L'application ne lit jamais les données de démonstration directement :
 * elle passe par cette interface asynchrone, qui imite les appels réseau.
 *
 * Bascule vers Supabase : créer un `supabaseProvider` qui implémente
 * `FournisseurRestaurants` avec `supabase.from('restaurants').select(...)`
 * (jointures plats + horaires), puis l'exporter ci-dessous à la place de
 * `demoProvider`. Aucun composant n'a besoin de changer.
 */
export interface FournisseurRestaurants {
  listerRestaurants(): Promise<Restaurant[]>
  trouverParSlug(slug: string): Promise<Restaurant | null>
}

const demoProvider: FournisseurRestaurants = {
  listerRestaurants() {
    return Promise.resolve(RESTAURANTS_DEMO)
  },
  trouverParSlug(slug: string) {
    return Promise.resolve(RESTAURANTS_DEMO.find((r) => r.slug === slug) ?? null)
  },
}

export const fournisseur: FournisseurRestaurants = demoProvider
