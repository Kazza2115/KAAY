import type { Restaurant } from '../../types'
import { ilYAJours } from '../../lib/dates'

import thieboudienne from '../../assets/plats/thieboudienne.svg'
import mafe from '../../assets/plats/mafe.svg'
import poissonGrille from '../../assets/plats/poisson-grille.svg'
import terrasseMer from '../../assets/plats/terrasse-mer.svg'
import brochettes from '../../assets/plats/brochettes.svg'
import dibi from '../../assets/plats/dibi.svg'
import bowlVege from '../../assets/plats/bowl-vege.svg'

/**
 * DONNÉES DE DÉMONSTRATION — cinq restaurants fictifs.
 *
 * Ces fiches ne correspondent à aucun établissement réel : les noms, numéros
 * de téléphone, adresses et images sont inventés pour tester le parcours.
 * Elles seront remplacées par les fiches vérifiées sur le terrain, servies
 * par Supabase (voir `src/data/provider.ts`).
 *
 * Les dates de confirmation sont calculées par rapport à aujourd'hui pour
 * illustrer la règle des 14 jours : certaines sont volontairement anciennes
 * afin de montrer l'état « à reconfirmer ».
 */
export const RESTAURANTS_DEMO: Restaurant[] = [
  {
    id: 'demo-1',
    slug: 'chez-astou',
    nom: 'Chez Astou',
    quartier: 'Médina',
    cuisines: ['Sénégalaise'],
    description:
      'Cantine familiale tenue par Astou depuis quinze ans. Le thiéboudienne mijote au feu de bois chaque matin et part souvent avant 14 h.',
    adresse: 'Rue 11 x 22, Médina, Dakar',
    latitude: 14.6779,
    longitude: -17.4529,
    telephone: '+221770000001',
    whatsapp: '+221770000001',
    surPlace: true,
    aEmporter: true,
    photos: [
      { src: thieboudienne, alt: 'Thiéboudienne rouge servi avec légumes et poisson' },
      { src: mafe, alt: 'Mafé de bœuf accompagné de riz blanc' },
    ],
    horaires: [
      { jour: 1, ouverture: '11:30', fermeture: '16:00' },
      { jour: 2, ouverture: '11:30', fermeture: '16:00' },
      { jour: 3, ouverture: '11:30', fermeture: '16:00' },
      { jour: 4, ouverture: '11:30', fermeture: '16:00' },
      { jour: 5, ouverture: '11:30', fermeture: '16:00' },
      { jour: 6, ouverture: '11:30', fermeture: '17:00' },
    ],
    horairesConfirmesLe: ilYAJours(3),
    plats: [
      { id: 'demo-1-p1', nom: 'Thiéboudienne rouge', categorie: 'plat', prixFcfa: 2500, prixConfirmeLe: ilYAJours(3) },
      { id: 'demo-1-p2', nom: 'Mafé de bœuf', categorie: 'plat', prixFcfa: 2000, prixConfirmeLe: ilYAJours(3) },
      { id: 'demo-1-p3', nom: 'Yassa poulet', categorie: 'plat', prixFcfa: 2500, prixConfirmeLe: ilYAJours(10) },
      { id: 'demo-1-p4', nom: 'Bissap frais', categorie: 'boisson', prixFcfa: 500, prixConfirmeLe: ilYAJours(3) },
    ],
    statut: 'publie',
    estDemo: true,
  },
  {
    id: 'demo-2',
    slug: 'le-ngor-grill',
    nom: 'Le Ngor Grill',
    quartier: 'Ngor',
    cuisines: ['Grillades', 'Fruits de mer'],
    description:
      'Terrasse face à la plage de Ngor. Le poisson du jour arrive des pirogues du matin et passe directement au gril.',
    adresse: 'Route de la plage de Ngor, Dakar',
    latitude: 14.7494,
    longitude: -17.5152,
    telephone: '+221780000002',
    whatsapp: '+221780000002',
    surPlace: true,
    aEmporter: false,
    photos: [
      { src: poissonGrille, alt: 'Thiof entier grillé, citron et oignons' },
      { src: terrasseMer, alt: 'Terrasse du restaurant face à la mer' },
      { src: brochettes, alt: 'Brochettes de lotte grillées' },
    ],
    horaires: [
      { jour: 0, ouverture: '12:00', fermeture: '23:30' },
      { jour: 1, ouverture: '12:00', fermeture: '23:30' },
      { jour: 2, ouverture: '12:00', fermeture: '23:30' },
      { jour: 3, ouverture: '12:00', fermeture: '23:30' },
      { jour: 4, ouverture: '12:00', fermeture: '23:30' },
      { jour: 5, ouverture: '12:00', fermeture: '00:30' },
      { jour: 6, ouverture: '12:00', fermeture: '00:30' },
    ],
    horairesConfirmesLe: ilYAJours(5),
    plats: [
      { id: 'demo-2-p1', nom: 'Thiof grillé entier', categorie: 'plat', prixFcfa: 6500, prixConfirmeLe: ilYAJours(5) },
      { id: 'demo-2-p2', nom: 'Brochettes de lotte', categorie: 'plat', prixFcfa: 5500, prixConfirmeLe: ilYAJours(5) },
      { id: 'demo-2-p3', nom: 'Gambas grillées', categorie: 'plat', prixFcfa: 8000, prixConfirmeLe: ilYAJours(5) },
      { id: 'demo-2-p4', nom: "Salade d'avocat", categorie: 'entree', prixFcfa: 3000, prixConfirmeLe: ilYAJours(5) },
    ],
    statut: 'publie',
    estDemo: true,
  },
  {
    id: 'demo-3',
    slug: 'dibiterie-khadim',
    nom: 'Dibiterie Khadim',
    quartier: 'Grand Yoff',
    cuisines: ['Dibiterie', 'Grillades'],
    description:
      'Dibiterie de quartier réputée pour son mouton grillé au kilo, servi sur papier kraft avec oignons et moutarde.',
    adresse: 'Arrêt Khar Yalla, Grand Yoff, Dakar',
    // Localisation en cours de contrôle sur le terrain : pas d'itinéraire fiable.
    latitude: null,
    longitude: null,
    telephone: '+221760000003',
    // Le gérant n'a pas communiqué de numéro WhatsApp.
    whatsapp: null,
    surPlace: true,
    aEmporter: true,
    photos: [{ src: dibi, alt: 'Dibi de mouton sur papier kraft avec oignons' }],
    // Horaires non confirmés : la fiche affiche « À confirmer ».
    horaires: null,
    horairesConfirmesLe: null,
    plats: [
      // Prix confirmés il y a plus de 14 jours : marqués « à reconfirmer »
      // et ignorés par le filtre budget.
      { id: 'demo-3-p1', nom: 'Dibi mouton (500 g)', categorie: 'plat', prixFcfa: 3000, prixConfirmeLe: ilYAJours(21) },
      { id: 'demo-3-p2', nom: 'Poulet braisé', categorie: 'plat', prixFcfa: 3500, prixConfirmeLe: ilYAJours(21) },
      { id: 'demo-3-p3', nom: 'Café Touba', categorie: 'boisson', prixFcfa: null, prixConfirmeLe: null },
    ],
    statut: 'publie',
    estDemo: true,
  },
  {
    id: 'demo-4',
    slug: 'saveurs-du-cap',
    nom: 'Saveurs du Cap',
    quartier: 'Plateau',
    cuisines: ['Cap-verdienne'],
    description:
      'Petite salle discrète derrière le marché Kermel. Cachupa mijotée à la commande et poisson séché comme à Mindelo.',
    adresse: '27 rue Victor Hugo, Plateau, Dakar',
    latitude: 14.6708,
    longitude: -17.4321,
    telephone: '+221330000004',
    whatsapp: '+221770000004',
    surPlace: true,
    aEmporter: true,
    // Photos en attente de l'accord du restaurant.
    photos: [],
    horaires: [
      { jour: 1, ouverture: '12:00', fermeture: '15:00' },
      { jour: 2, ouverture: '12:00', fermeture: '15:00' },
      { jour: 3, ouverture: '12:00', fermeture: '15:00' },
      { jour: 4, ouverture: '12:00', fermeture: '15:00' },
      { jour: 5, ouverture: '12:00', fermeture: '15:00' },
      { jour: 4, ouverture: '19:00', fermeture: '22:30' },
      { jour: 5, ouverture: '19:00', fermeture: '23:00' },
      { jour: 6, ouverture: '19:00', fermeture: '23:00' },
    ],
    horairesConfirmesLe: ilYAJours(6),
    plats: [
      { id: 'demo-4-p1', nom: 'Cachupa refogada', categorie: 'plat', prixFcfa: 4000, prixConfirmeLe: ilYAJours(6) },
      { id: 'demo-4-p2', nom: 'Poisson séché, riz coco', categorie: 'plat', prixFcfa: 4500, prixConfirmeLe: ilYAJours(6) },
      { id: 'demo-4-p3', nom: 'Pastel de thon (3 pièces)', categorie: 'entree', prixFcfa: 1500, prixConfirmeLe: ilYAJours(6) },
    ],
    statut: 'publie',
    estDemo: true,
  },
  {
    id: 'demo-5',
    slug: 'teranga-vege',
    nom: 'Teranga Végé',
    quartier: 'Point E',
    cuisines: ['Végétarienne', 'Sénégalaise'],
    description:
      'Cuisine végétarienne à base de produits locaux : fonio, niébé, légumes du marché de Tilène et jus maison.',
    adresse: 'Rue de Kaolack, Point E, Dakar',
    latitude: 14.6937,
    longitude: -17.4622,
    telephone: '+221750000005',
    whatsapp: '+221750000005',
    surPlace: true,
    aEmporter: true,
    photos: [{ src: bowlVege, alt: 'Bol végétarien au fonio, avocat et légumes' }],
    horaires: [
      { jour: 1, ouverture: '09:00', fermeture: '21:00' },
      { jour: 2, ouverture: '09:00', fermeture: '21:00' },
      { jour: 3, ouverture: '09:00', fermeture: '21:00' },
      { jour: 4, ouverture: '09:00', fermeture: '21:00' },
      { jour: 5, ouverture: '09:00', fermeture: '21:00' },
      { jour: 6, ouverture: '10:00', fermeture: '21:00' },
    ],
    horairesConfirmesLe: ilYAJours(2),
    plats: [
      { id: 'demo-5-p1', nom: 'Bol fonio & légumes', categorie: 'plat', prixFcfa: 3000, prixConfirmeLe: ilYAJours(2) },
      { id: 'demo-5-p2', nom: 'Salade de niébé', categorie: 'entree', prixFcfa: 2000, prixConfirmeLe: ilYAJours(2) },
      { id: 'demo-5-p3', nom: 'Accara sauce kaani', categorie: 'entree', prixFcfa: 1000, prixConfirmeLe: ilYAJours(2) },
      { id: 'demo-5-p4', nom: 'Jus de gingembre', categorie: 'boisson', prixFcfa: 800, prixConfirmeLe: ilYAJours(2) },
      { id: 'demo-5-p5', nom: 'Thiakry', categorie: 'dessert', prixFcfa: null, prixConfirmeLe: null },
    ],
    statut: 'publie',
    estDemo: true,
  },
]
