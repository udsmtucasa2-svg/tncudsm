import { Link } from 'react-router-dom';
import { LuCalendarDays, LuClock, LuMapPin, LuLandmark, LuArrowRight } from 'react-icons/lu';
import { fmtDate } from '../lib/arrange.js';
import './EventCard.css';

// Shared by the Events page and anywhere else events are listed.
// Details are in an aligned label/value list (Time, Date, Department, Location).
export function EventFacts({ e }) {
  return (
    <dl className="facts">
      <div><dt><LuClock aria-hidden="true" />Time</dt><dd>{e.time}</dd></div>
      <div><dt><LuCalendarDays aria-hidden="true" />Date</dt><dd>{fmtDate(e.date, { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>
      {e.department && <div><dt><LuLandmark aria-hidden="true" />Department</dt><dd>{e.department}</dd></div>}
      <div><dt><LuMapPin aria-hidden="true" />Location</dt><dd>{e.location}</dd></div>
    </dl>
  );
}

export default function EventCard({ e, past, compact }) {
  const day = new Date(`${e.date}T00:00:00`).getDate();
  return (
    <Link to={`/events/${e.id}`} className={`card ecard fx fx-up fx-teal ${past ? 'ecard--past' : ''}`}>
      <div className="ecard__media">
        {e.image ? <img src={e.image} alt="" loading="lazy" /> : <LuCalendarDays aria-hidden="true" />}
        <div className="date-chip"><b>{day}</b>{fmtDate(e.date, { month: 'short' })}</div>
      </div>
      <div className="ecard__body">
        <h3>{e.title}</h3>
        <EventFacts e={e} />
        {!compact && e.description && <p className="ecard__text">{e.description}</p>}
        <span className="card__more">View details <LuArrowRight aria-hidden="true" /></span>
      </div>
    </Link>
  );
}
