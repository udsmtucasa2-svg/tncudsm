import { LuPlay, LuUser, LuCalendarDays, LuArrowRight } from 'react-icons/lu';
import { fmtDate } from '../lib/arrange.js';
import './SermonCard.css';

// One sermon card for the Sermons page and the home page.
export default function SermonCard({ s }) {
  return (
    <a href={s.url} target="_blank" rel="noreferrer" className="card ecard fx fx-side fx-teal">
      <div className="ecard__media sermon-media"><span className="play"><LuPlay aria-hidden="true" /></span></div>
      <div className="ecard__body">
        <span className="badge">{s.series || 'Sermon'}</span>
        <h3>{s.title}</h3>
        <dl className="facts">
          <div><dt><LuUser aria-hidden="true" />Speaker</dt><dd>{s.speaker}</dd></div>
          <div><dt><LuCalendarDays aria-hidden="true" />Date</dt><dd>{fmtDate(s.date, { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>
        </dl>
        <span className="card__more">Listen / Watch <LuArrowRight aria-hidden="true" /></span>
      </div>
    </a>
  );
}
