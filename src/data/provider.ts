import type { Restaurant } from '../types'
import { RESTAURANTS_DEMO } from './demo/restaurants'
import { creerSupabaseProvider } from './supabaseProvider'

/**
 * Fournisseur de données.
 *
 * L'application ne lit jamais les données directement : elle passe par
 * cette interface asynchrone, qui imite les appels réseau.
 *
 * Par défaut, les 5 fiches fictives de démonstration. Dès que
 * VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies au build
 * (.env.local en local, variables du workflow de déploiement), les
 * fiches vérifiées de Supabase prennent le relais — aucun composant
 * à modifier (schéma : supabase/schema.sql).
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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseCle = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const fournisseur: FournisseurRestaurants =
  supabaseUrl && supabaseCle ? creerSupabaseProvider(supabaseUrl, supabaseCle) : demoProvider
