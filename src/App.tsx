import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Accueil } from './pages/Accueil'
import { FicheRestaurant } from './pages/FicheRestaurant'
import { PageIntrouvable } from './pages/PageIntrouvable'

export default function App() {
  return (
    <div className="application">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/restaurant/:slug" element={<FicheRestaurant />} />
          <Route path="*" element={<PageIntrouvable />} />
        </Routes>
      </main>
      <footer className="pied">
        <p>
          <strong>Version de démonstration.</strong> Les cinq restaurants affichés sont
          fictifs : ils servent à tester le parcours avant l'arrivée des fiches
          vérifiées sur le terrain à Dakar.
        </p>
        <p className="pied-signature">Kaay — fait à Dakar.</p>
      </footer>
    </div>
  )
}
