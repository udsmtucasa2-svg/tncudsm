import { useState } from 'react';
import { Icon } from '../lib/icons.jsx';
import './Blobcard.css';

// Shared "blob" card: an organic grey ring with a picture (or icon) inside, then a title and a short text.
// image: one URL, or a list of URLs to try in order. If none loads, the icon is shown instead.
// badge: optional small number shown on the corner of the blob (used for the 28 beliefs).
// tone: 'teal' | 'gold' | 'navy' (colour of the icon blob and badge).
export default function BlobCard({ icon, image, title, text, tone = 'teal', badge, children }) {
  const candidates = [].concat(image || []).filter(Boolean);
  const [tried, setTried] = useState(0);          // how many candidates have failed so far
  const src = candidates[tried];
  return (
    <article className={`blob-card blob-card--${tone}`}>
      <span className="blob" aria-hidden="true">
        <span className={`blob__in ${src ? 'blob__in--img' : ''}`}>
          {src
            ? <img key={src} src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setTried((t) => t + 1)} />
            : <Icon name={icon} />}
        </span>
        {badge != null && <span className="blob__badge">{badge}</span>}
      </span>
      <div className="blob-card__body">
        <h3>{title}</h3>
        {text && <p>{text}</p>}
        {children}
      </div>
    </article>
  );
}

// Three-column grid (2 on tablets, compact rows on phones).
export function BlobGrid({ children, className = '' }) {
  return <div className={`blob-grid ${className}`.trim()}>{children}</div>;
}