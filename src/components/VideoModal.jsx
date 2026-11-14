import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LuX, LuExternalLink } from 'react-icons/lu';
import './VideoModal.css';

// A pop-up player. Pass `video` from parseYouTube(). Closes with the X, the dark area, or Escape.
// Reusable for any page that has a YouTube link (sermons today, events or resources later).
export default function VideoModal({ video, title, subtitle, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return createPortal(
    <div className="vmodal" role="dialog" aria-modal="true" aria-label={title || 'Video'}>
      <button type="button" className="vmodal__scrim" aria-label="Close video" onClick={onClose} tabIndex={-1} />
      <div className="vmodal__box">
        <button type="button" ref={closeRef} className="vmodal__close" onClick={onClose} aria-label="Close video"><LuX aria-hidden="true" /></button>
        <div className="vmodal__frame">
          <iframe
            src={video.embed(true)}
            title={title || 'Video player'}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="vmodal__bar">
          <div>
            {title && <b>{title}</b>}
            {subtitle && <small>{subtitle}</small>}
          </div>
          <a href={video.watch} target="_blank" rel="noreferrer">Open on {video.site || 'YouTube'} <LuExternalLink aria-hidden="true" /></a>
        </div>
      </div>
    </div>,
    document.body,
  );
}