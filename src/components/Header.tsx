import { Link } from 'react-router-dom'

/** En-tête commun : marque Kaay et liseré aux couleurs du Sénégal. */
export function Header() {
  return (
    <header className="entete">
      <div className="entete-contenu">
        <Link to="/" className="marque" aria-label="Kaay — retour à l'accueil">
          <span className="marque-nom">Kaay</span>
          <span className="marque-etoile" aria-hidden="true">
            ★
          </span>
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
