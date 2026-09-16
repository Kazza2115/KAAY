# Kaay — Où manger à Dakar

Première version fonctionnelle de Kaay : une application web (React + TypeScript +
Vite) qui aide à trouver où manger à Dakar selon son quartier, ses envies et son
budget, puis à contacter directement le restaurant.

**Version de démonstration** : les cinq restaurants affichés sont fictifs et
clairement marqués « Démo ». Ils seront remplacés par les fiches vérifiées sur le
terrain, servies par Supabase.

## Lancer le projet

```bash
npm install        # une seule fois
npm run dev        # serveur de développement → http://localhost:5173
```

Autres commandes :

```bash
npm run build      # vérification TypeScript + build de production dans dist/
npm run preview    # sert le build de production en local
npm run lint       # lint (oxlint)
```

## Ce que couvre cette V1

- **Accueil** : recherche libre (nom, plat, cuisine, quartier — insensible aux
  accents) et filtres simples : quartier, cuisine, budget en FCFA, à emporter.
  Les critères vivent dans l'URL : le retour depuis une fiche les conserve.
- **Résultats** : cartes avec photo, nom, quartier, cuisine, prix d'un plat
  représentatif et fraîcheur de l'information. Tri par pertinence ou nom.
- **Fiche restaurant** : photos, description courte, plats et prix en FCFA,
  horaires (fuseau Africa/Dakar) avec le jour courant mis en évidence, adresse.
- **Contact** : boutons WhatsApp, Appeler et Itinéraire. Les fiches étant
  fictives, les actions sont **simulées** : une fenêtre explique ce qui se
  passerait en production, sans contacter personne.
- **Règle des 14 jours** (pilote) : un prix ou des horaires confirmés il y a plus
  de 14 jours sont marqués « à reconfirmer » et ne servent plus aux filtres
  correspondants.
- **États prévus** : aucun résultat, photo à venir, prix à confirmer, horaires à
  confirmer, localisation en cours de vérification, fiche introuvable.
- **Signalement** : chaque fiche propose d'envoyer une correction à l'équipe
  (action simulée elle aussi).

Hors périmètre, conformément au plan : comptes, paiements, réservations, avis.

## Structure

```
src/
  types.ts              Modèle de données (aligné sur le futur schéma Supabase)
  data/
    provider.ts         Fournisseur de données (interface asynchrone)
    demo/restaurants.ts Les 5 fiches fictives de démonstration
  lib/
    filtres.ts          Recherche, filtres, tri, plat représentatif
    horaires.ts         État ouvert/fermé dans le fuseau Africa/Dakar
    dates.ts            Règle de fraîcheur des 14 jours
    format.ts           FCFA, téléphone, normalisation de recherche
  components/           En-tête, filtres, cartes, badges, contact, modale…
  pages/                Accueil, fiche restaurant, page introuvable
  styles/global.css     Direction artistique (palette Sénégal, mobile d'abord)
  assets/plats/         Illustrations de démonstration (remplaçables par photos)
```

## Bascule vers Supabase

Les composants ne lisent jamais les données de démonstration directement : ils
passent par l'interface `FournisseurRestaurants` de `src/data/provider.ts`,
asynchrone comme un appel réseau. Pour brancher Supabase :

1. Créer les tables `restaurants`, `plats` et `horaires` sur le modèle des types
   de `src/types.ts` (dates de confirmation comprises).
2. Écrire un `supabaseProvider` qui implémente `listerRestaurants()` et
   `trouverParSlug()` avec `supabase.from(...)`.
3. L'exporter à la place de `demoProvider` dans `provider.ts`.

Les images (`Photo.src`) deviendront des URL Supabase Storage sans changement
de composant. Le fichier `public/_redirects` prépare l'hébergement statique
(type Cloudflare Pages) pour les routes de l'application monopage.
