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
          <strong>Démo</strong> — restaurants fictifs, en attendant les fiches vérifiées
          sur le terrain.
        </p>
        <p className="pied-signature">Kaay — fait à Dakar</p>
      </footer>
    </div>
  )
}
