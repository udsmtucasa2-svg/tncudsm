import { useEffect, useState } from 'react';
import { LuFileText } from 'react-icons/lu';
import { fmtDate } from '../lib/arrange.js';
import './AnnouncementCard.css';

// Browsers refuse to open a "data:" PDF in a new tab, so in local preview mode (where uploads are
// stored as data URLs) we turn it into a temporary blob link. Real https links pass straight through.
function usePdfHref(url) {
  const [href, setHref] = useState(url && !url.startsWith('data:') ? url : '');
  useEffect(() => {
    if (!url || !url.startsWith('data:')) { setHref(url || ''); return undefined; }
    let objectUrl;
    let alive = true;
    fetch(url)
      .then((r) => r.blob())
      .then((b) => { if (alive) { objectUrl = URL.createObjectURL(b); setHref(objectUrl); } })
      .catch(() => alive && setHref(''));
    return () => { alive = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [url]);
  return href;
}

// One announcement. The admin uploads a PDF; the card shows a PDF icon, the date and the word
// "Announcements". Tapping it opens the PDF. Used on the home page and the News page.
export default function AnnouncementCard({ a }) {
  const href = usePdfHref(a.pdf);
  const date = fmtDate(a.date, { day: 'numeric', month: 'long', year: 'numeric' });
  const label = `${a.title ? `${a.title}, ` : ''}${date}. Open announcement PDF`;
  const Tag = href ? 'a' : 'div';
  const link = href ? { href, target: '_blank', rel: 'noreferrer', 'aria-label': label } : {};

  return (
    <Tag className="acard" {...link}>
      <span className="acard__blob" aria-hidden="true" />
      <span className="acard__pdf" aria-hidden="true">
        <LuFileText />
        <b>PDF</b>
      </span>
      <span className="acard__text">
        <span className="acard__date">{date}</span>
        <span className="acard__label">Announcements</span>
        {a.title && <span className="acard__title">{a.title}</span>}
        {!a.pdf && a.text && <span className="acard__title">{a.text}</span>}
      </span>
    </Tag>
  );
}