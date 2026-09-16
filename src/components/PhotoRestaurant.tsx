import type { Photo } from '../types'

interface Props {
  photo: Photo | null
  className?: string
}

/** Photo d'un restaurant, ou emplacement neutre quand elle manque encore. */
export function PhotoRestaurant({ photo, className }: Props) {
  if (!photo) {
    return (
      <div className={`photo-absente ${className ?? ''}`} role="img" aria-label="Photo à venir">
        <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
          <rect x="6" y="12" width="36" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="24" cy="26" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M18 12l3-5h6l3 5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
        <span>Photo à venir</span>
      </div>
    )
  }
  return <img className={className} src={photo.src} alt={photo.alt} loading="lazy" />
}
