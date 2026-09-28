# Kaay — guide pour Claude Code

Application de découverte de restaurants à Dakar (pilote à coût zéro).
React 19 + TypeScript + Vite. Interface entièrement en français, prix en
FCFA, mobile d'abord. Site déployé automatiquement sur GitHub Pages :
https://kazza2115.github.io/KAAY/

## Commandes

```bash
npm install        # une fois
npm run dev        # développement → http://localhost:5173
npm run build      # tsc + vite build — doit passer avant tout push
npm run lint       # oxlint — zéro avertissement attendu
npm run preview    # sert le build (utilisé par les tests Playwright)
```

## Règles du projet

- **Chaque poussée sur `claude/sweet-keller-md08m4` déploie le site en
  ligne.** Travailler sur une branche et passer par une pull request,
  ou ne pousser qu'un état vérifié (build + lint + parcours mobile).
- Les 5 restaurants sont **fictifs** (marqués « Démo ») :
  `src/data/demo/restaurants.ts`. Les actions WhatsApp/Appel/Itinéraire
  sont volontairement **simulées** pour ces fiches.
- Les composants ne lisent jamais les données directement : tout passe
  par `FournisseurRestaurants` (`src/data/provider.ts`), prévu pour être
  remplacé par Supabase sans toucher aux composants.
- Règle des 14 jours (`src/lib/dates.ts`) : un prix ou des horaires
  confirmés il y a plus de 14 jours sont « à reconfirmer » et ne servent
  plus aux filtres.
- Horaires calculés dans le fuseau **Africa/Dakar**, plages passant
  minuit gérées (`src/lib/horaires.ts`).
- Direction artistique : jetons CSS en tête de `src/styles/global.css`
  (vert #00853F, jaune #FDEF42, rouge #E31B23, fond froid #f4f6f7).
  Sobriété : pas de dégradés voyants ni d'animations lourdes ; tout
  mouvement respecte `prefers-reduced-motion`. Aucune dépendance
  d'interface supplémentaire (CSS pur + API navigateur).
- Hors périmètre V1 : comptes, paiements, réservations, avis.
- Pas d'anglais dans l'interface ; textes courts, le site doit rester
  compréhensible sans explication.

## Vérifications avant de pousser

`npm run build`, `npm run lint` puis `npm run test:mobile` (parcours
mobile complet dans Chromium ; en local sans navigateur Playwright,
définir CHROMIUM_PATH vers un Chromium existant). La CI
(`.github/workflows/ci.yml`) rejoue ces trois étapes sur chaque
poussée et pull request.

## Bascule Supabase

Déjà codée : `supabase/schema.sql` + `src/data/supabaseProvider.ts`
(fetch/PostgREST, aucune dépendance). Elle s'active au build quand
`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont définies ; sinon
les 5 fiches de démo servent de données. Réglages de lancement
(WhatsApp équipe, URL publique) : `src/config.ts`. Guide de collecte
terrain : `docs/collecte-fiches.md`.
