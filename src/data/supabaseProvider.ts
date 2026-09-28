import type { Photo, PlageHoraire, Plat, Restaurant } from '../types'
import type { FournisseurRestaurants } from './provider'

/**
 * Fournisseur Supabase, via l'API REST (PostgREST) en `fetch` pur :
 * aucune dépendance ajoutée, seulement la lecture des fiches publiées
 * (la politique RLS de supabase/schema.sql refuse tout le reste).
 *
 * Activation : définir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
 * (fichier .env.local en local, variables du workflow en déploiement),
 * puis reconstruire — `src/data/provider.ts` bascule tout seul.
 */

const SELECTION = 'select=*,plats(*)&statut=eq.publie'

/** Ligne renvoyée par PostgREST (colonnes en snake_case). */
interface LignePlat {
  id: string
  nom: string
  categorie: Plat['categorie']
  prix_fcfa: number | null
  prix_confirme_le: string | null
}

interface LigneRestaurant {
  id: string
  slug: string
  nom: string
  quartier: string
  cuisines: string[] | null
  description: string | null
  adresse: string | null
  latitude: number | null
  longitude: number | null
  telephone: string | null
  whatsapp: string | null
  sur_place: boolean
  a_emporter: boolean
  photos: Photo[] | null
  horaires: PlageHoraire[] | null
  horaires_confirmes_le: string | null
  statut: 'publie' | 'brouillon'
  populaire: boolean
  est_demo: boolean
  plats: LignePlat[] | null
}

function versRestaurant(ligne: LigneRestaurant): Restaurant {
  return {
    id: ligne.id,
    slug: ligne.slug,
    nom: ligne.nom,
    quartier: ligne.quartier,
    cuisines: ligne.cuisines ?? [],
    description: ligne.description,
    adresse: ligne.adresse,
    latitude: ligne.latitude,
    longitude: ligne.longitude,
    telephone: ligne.telephone,
    whatsapp: ligne.whatsapp,
    surPlace: ligne.sur_place,
    aEmporter: ligne.a_emporter,
    photos: ligne.photos ?? [],
    horaires: ligne.horaires,
    horairesConfirmesLe: ligne.horaires_confirmes_le,
    plats: (ligne.plats ?? []).map((p) => ({
      id: p.id,
      nom: p.nom,
      categorie: p.categorie,
      prixFcfa: p.prix_fcfa,
      prixConfirmeLe: p.prix_confirme_le,
    })),
    statut: ligne.statut,
    populaire: ligne.populaire,
    estDemo: ligne.est_demo,
  }
}

export function creerSupabaseProvider(url: string, cleAnon: string): FournisseurRestaurants {
  async function requete(filtres: string): Promise<LigneRestaurant[]> {
    const reponse = await fetch(`${url}/rest/v1/restaurants?${SELECTION}${filtres}`, {
      headers: { apikey: cleAnon, Authorization: `Bearer ${cleAnon}` },
    })
    if (!reponse.ok) {
      throw new Error(`Supabase a répondu ${reponse.status}`)
    }
    return (await reponse.json()) as LigneRestaurant[]
  }

  return {
    async listerRestaurants() {
      const lignes = await requete('&order=nom.asc')
      return lignes.map(versRestaurant)
    },
    async trouverParSlug(slug: string) {
      const lignes = await requete(`&slug=eq.${encodeURIComponent(slug)}&limit=1`)
      return lignes.length > 0 ? versRestaurant(lignes[0]) : null
    },
  }
}
