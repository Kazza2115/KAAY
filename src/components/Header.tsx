import { Link } from 'react-router-dom'
import logoKaay from '../assets/logo-kaay.svg'

/** En-tête commun : logo officiel Kaay et liseré aux couleurs du Sénégal. */
export function Header() {
  return (
    <header className="entete">
      <div className="entete-contenu">
        <Link to="/" className="marque" aria-label="Kaay — retour à l'accueil">
          <img src={logoKaay} alt="Kaay" className="marque-logo" />
        </Link>
        <p className="marque-slogan">Où manger à Dakar</p>
      </div>
      <div className="lisere-senegal" aria-hidden="true">
        <span className="lisere-vert" />
        <span className="lisere-jaune" />
        <span className="lisere-rouge" />
      </div>
    </header>
  )
}
