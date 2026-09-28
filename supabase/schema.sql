-- Schéma Supabase de Kaay (à exécuter dans SQL Editor à la création du projet).
--
-- Correspond aux types de src/types.ts. Le site ne fait que LIRE les fiches
-- publiées (RLS ci-dessous) ; l'écriture passe par le tableau de bord
-- Supabase ou la clé service, jamais par le navigateur.

create table restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nom text not null,
  quartier text not null,
  -- Types de plats : « Viande », « Poulet », « Poisson », « Fruits de mer »,
  -- « Hamburger », « Végétarien »… (vocabulaire libre, affiché tel quel).
  cuisines text[] not null default '{}',
  description text,
  adresse text,
  latitude double precision,
  longitude double precision,
  telephone text,          -- format international, ex. +221771234567
  whatsapp text,           -- format international
  sur_place boolean not null default true,
  a_emporter boolean not null default false,
  -- [{ "src": "https://…", "alt": "…" }] — URL Supabase Storage de préférence.
  photos jsonb not null default '[]',
  -- [{ "jour": 1, "ouverture": "11:30", "fermeture": "16:00" }]
  -- jour : 0 = dimanche … 6 = samedi ; fermeture < ouverture = passe minuit.
  horaires jsonb,
  horaires_confirmes_le date,
  statut text not null default 'brouillon' check (statut in ('publie', 'brouillon')),
  populaire boolean not null default false,
  est_demo boolean not null default false,
  cree_le timestamptz not null default now()
);

create table plats (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants (id) on delete cascade,
  nom text not null,
  categorie text not null default 'plat' check (categorie in ('plat', 'entree', 'dessert', 'boisson')),
  prix_fcfa integer,       -- null = prix à confirmer
  prix_confirme_le date    -- null ou > 14 jours = « à reconfirmer »
);

create index plats_restaurant on plats (restaurant_id);

-- Lecture publique limitée aux fiches publiées ; aucune écriture publique.
alter table restaurants enable row level security;
alter table plats enable row level security;

create policy "lecture publique des fiches publiees"
  on restaurants for select
  using (statut = 'publie');

create policy "lecture publique des plats publies"
  on plats for select
  using (exists (
    select 1 from restaurants r
    where r.id = plats.restaurant_id and r.statut = 'publie'
  ));
