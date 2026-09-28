/**
 * Parcours mobile de référence (390 px), à faire passer avant tout push :
 *
 *   npm run build && npm run test:mobile
 *
 * Le script sert le build (vite preview), rejoue le parcours dans Chromium
 * et sort en erreur au premier écart. En local, si Playwright n'a pas
 * téléchargé son navigateur, indiquer un Chromium existant via CHROMIUM_PATH.
 */
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = 4173
const BASE = `http://localhost:${PORT}`

let echecs = 0
function verifier(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`)
  } else {
    echecs++
    console.error(`  ✗ ${message}`)
  }
}

// --- Servir le build -------------------------------------------------------
const serveur = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
})
process.on('exit', () => serveur.kill())

async function attendreServeur() {
  for (let essai = 0; essai < 60; essai++) {
    try {
      const r = await fetch(BASE)
      if (r.ok) return
    } catch {
      /* pas encore prêt */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('Le serveur de prévisualisation ne répond pas — lancer npm run build ?')
}
await attendreServeur()

// --- Parcours --------------------------------------------------------------
const navigateur = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
})
const contexte = await navigateur.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  locale: 'fr-FR',
  geolocation: { latitude: 14.6708, longitude: -17.4467 }, // Plateau, Dakar
  permissions: ['geolocation'],
})
const page = await contexte.newPage()
const erreursConsole = []
page.on('pageerror', (e) => erreursConsole.push(String(e)))
page.on('console', (m) => m.type() === 'error' && erreursConsole.push(m.text()))

console.log('Accueil et rubriques')
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
verifier((await page.locator('.rubrique h2').count()) >= 3, 'au moins trois rubriques affichées')
verifier(
  (await page.locator('.categorie').count()) >= 4,
  'catégories illustrées présentes',
)
verifier(
  (await page.locator('.carte-distance').first().textContent())?.includes('km'),
  'distances en km affichées (géolocalisation)',
)

console.log('Filtres')
await page.selectOption('select >> nth=0', 'Médina')
await page.waitForTimeout(300)
verifier((await page.locator('.carte').count()) === 1, 'filtre quartier Médina → 1 restaurant')
await page.selectOption('select >> nth=0', '')
await page.getByRole('button', { name: 'Plus de filtres' }).click()
await page.getByRole('button', { name: '5 000 F et plus' }).click()
await page.waitForTimeout(300)
verifier(
  (await page.locator('.carte-nom').allTextContents()).join() === 'Le Ngor Grill',
  'budget « 5 000 F et plus » → Le Ngor Grill seul',
)
await page.selectOption('select >> nth=0', 'Médina')
await page.waitForTimeout(300)
verifier((await page.locator('.carte').count()) === 0, 'critères incompatibles → état vide')
await page.getByRole('button', { name: 'Effacer les filtres' }).click()
await page.waitForTimeout(300)
verifier((await page.locator('.rubrique').count()) >= 3, 'effacement → retour aux rubriques')

console.log('Recherche')
await page.fill('input[type=search]', 'boeuf')
await page.waitForTimeout(500)
verifier(
  (await page.locator('.carte-nom').allTextContents()).join() === 'Chez Astou',
  'recherche « boeuf » (ligature œ) → Chez Astou',
)
await page.fill('input[type=search]', '')
await page.waitForTimeout(400)

console.log('Fiche et retour')
await page.getByRole('button', { name: 'À emporter' }).click()
await page.waitForTimeout(300)
await page.locator('.carte-lien').first().click()
await page.waitForURL('**/restaurant/**')
await page.waitForTimeout(400)
verifier(page.url().includes('/restaurant/'), 'navigation vers une fiche')
verifier((await page.title()).includes('Kaay'), "titre d'onglet dédié")
await page.getByRole('link', { name: /WhatsApp/ }).click()
await page.waitForTimeout(300)
verifier(
  await page.getByRole('button', { name: 'OK' }).isVisible(),
  'action WhatsApp simulée (fiche fictive)',
)
await page.getByRole('button', { name: 'OK' }).click()
await page.getByRole('button', { name: 'Résultats' }).click()
await page.waitForTimeout(400)
verifier(page.url().includes('emporter=1'), 'retour avec filtres conservés')

console.log('Informations manquantes')
await page.goto(`${BASE}/restaurant/dibiterie-khadim`, { waitUntil: 'networkidle' })
verifier(
  (await page.textContent('body'))?.includes('À reconfirmer') ?? false,
  'prix anciens marqués « À reconfirmer »',
)
await page.goto(`${BASE}/restaurant/nexiste-pas`, { waitUntil: 'networkidle' })
verifier(
  (await page.textContent('h1'))?.includes('introuvable') ?? false,
  'fiche inexistante → page introuvable',
)

verifier(erreursConsole.length === 0, `aucune erreur console (${erreursConsole.join(' | ')})`)

await navigateur.close()
serveur.kill()

if (echecs > 0) {
  console.error(`\n${echecs} vérification(s) en échec`)
  process.exit(1)
}
console.log('\nParcours mobile : tout est bon.')
process.exit(0)
