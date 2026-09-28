import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

// Préfixe des routes aligné sur la base Vite : '' en local,
// '/KAAY' quand le site est servi depuis GitHub Pages.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

// PWA : hors-ligne léger et « Ajouter à l'écran d'accueil ».
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Sans service worker, le site fonctionne normalement en ligne.
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
