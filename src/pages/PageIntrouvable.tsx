import { Link } from 'react-router-dom'

/** Page 404 : fiche inexistante ou adresse erronée. */
export function PageIntrouvable() {
  return (
    <div className="page etat-vide">
      <h1>Fiche introuvable</h1>
      <p>
        Ce restaurant n'existe pas ou n'est plus publié. Le catalogue évolue au fil
        des vérifications de l'équipe.
      </p>
      <Link to="/" className="bouton bouton-principal">
        Voir les restaurants
      </Link>
    </div>
  )
}
