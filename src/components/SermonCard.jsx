import { useState } from 'react';
import { LuPlay, LuUser, LuCalendarDays, LuArrowRight } from 'react-icons/lu';
import VideoModal from './VideoModal.jsx';
import { fmtDate } from '../lib/arrange.js';
import { parseVideo, useVideoThumb } from '../lib/video.js';
import './SermonCard.css';

// One sermon card for the Sermons page and the home page.
// Shows a thumbnail: the picture the admin uploaded, or the one YouTube / Vimeo provides automatically.
// A YouTube or Vimeo link plays in a pop-up on this page; any other link opens in a new tab, as before.
export default function SermonCard({ s }) {
  const video = parseVideo(s.url);
  const thumb = useVideoThumb(video, s.thumbnail);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState('');

  // Plain click plays here; ctrl/cmd/middle-click still opens the link in a new tab.
  const onClick = video ? (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    setOpen(true);
  } : undefined;

  return (
    <>
      <a href={s.url} target="_blank" rel="noreferrer" onClick={onClick} className="card ecard fx fx-side fx-teal">
        <div className="ecard__media sermon-media">
          {thumb && failed !== thumb && <img src={thumb} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(thumb)} />}
          <span className="play"><LuPlay aria-hidden="true" /></span>
        </div>
        <div className="ecard__body">
          <span className="badge">{s.series || 'Sermon'}</span>
          <h3>{s.title}</h3>
          <dl className="facts">
            <div><dt><LuUser aria-hidden="true" />Speaker</dt><dd>{s.speaker}</dd></div>
            <div><dt><LuCalendarDays aria-hidden="true" />Date</dt><dd>{fmtDate(s.date, { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>
          </dl>
          <span className="card__more">{video ? 'Watch now' : 'Listen / Watch'} <LuArrowRight aria-hidden="true" /></span>
        </div>
      </a>
      {open && video && <VideoModal video={video} title={s.title} subtitle={[s.speaker, fmtDate(s.date)].filter(Boolean).join(' · ')} onClose={() => setOpen(false)} />}
    </>
  );
}