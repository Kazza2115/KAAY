# Collecte des fiches restaurants — équipe terrain

Objectif du pilote : 20 fiches vérifiées dans le quartier choisi.
Une fiche n'est **publiée** que si elle remplit les trois critères du plan :

1. **Un contact joignable** (téléphone testé, WhatsApp si le gérant en donne un) ;
2. **Une localisation contrôlée** (position GPS relevée sur place) ;
3. **Plusieurs prix datés** (3 à 5 plats représentatifs, relevés le jour de la visite).

Les horaires inconnus restent explicitement inconnus — ne jamais recopier
une autre plateforme sans vérifier. Noter la source de chaque information
et obtenir l'accord du restaurant pour les photos.

## À relever par restaurant

| Champ | Exemple | Obligatoire |
|---|---|---|
| Nom | Chez Astou | oui |
| Quartier | Médina | oui |
| Types de plats | Poisson, Viande, Poulet | oui (vocabulaire : Viande, Poulet, Poisson, Fruits de mer, Hamburger, Végétarien…) |
| Description (1-2 phrases) | Cantine familiale… | conseillé |
| Adresse | Rue 11 x 22, Médina | oui |
| Position GPS (lat, lng) | 14.6779, -17.4529 | oui |
| Téléphone public | +221 77 123 45 67 | oui (testé) |
| WhatsApp | +221 77 123 45 67 | si le gérant accepte |
| Sur place / à emporter | oui / oui | oui |
| 3 à 5 plats + prix FCFA | Thiéboudienne — 2 500 F | oui, avec la **date du relevé** |
| Horaires par jour | lun-sam 11 h 30 – 16 h | si confirmés (sinon « à confirmer ») |
| 1-2 photos | plat signature, devanture | avec accord écrit/WhatsApp |

## Rythme de vérification (règle des 14 jours)

Un prix ou des horaires non reconfirmés depuis plus de 14 jours passent
automatiquement « à reconfirmer » sur le site et ne servent plus aux
filtres. Recontrôler chaque semaine un échantillon tournant de 10 fiches.

## Saisie

Les fiches vérifiées sont saisies dans Supabase (tables `restaurants` et
`plats`, schéma : `supabase/schema.sql`), statut `brouillon` puis `publie`
après contrôle des doublons par le responsable du catalogue.
