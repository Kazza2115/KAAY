/** Formats d'affichage : prix en FCFA et texte normalisé pour la recherche. */

const formatNombre = new Intl.NumberFormat('fr-FR')

/** « 2 500 F » — le format court utilisé partout dans l'interface. */
export function formatFcfa(prix: number): string {
  return `${formatNombre.format(prix)} F`
}

/** « +221770000001 » → « +221 77 000 00 01 » pour l'affichage. */
export function formatTelephone(numero: string): string {
  const chiffres = numero.replace(/[^\d+]/g, '')
  const local = chiffres.startsWith('+221') ? chiffres.slice(4) : chiffres
  if (local.length === 9) {
    return `+221 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7)}`
  }
  return numero
}

/**
 * Normalise un texte pour la recherche : minuscules, sans accents ni
 * ligatures, afin que « thieb » trouve « Thiéboudienne » et que « boeuf »
 * trouve « bœuf » (la ligature « œ » n'a pas de décomposition Unicode).
 */
export function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}
