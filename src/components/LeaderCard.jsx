import { LuPhone, LuMail } from 'react-icons/lu';

const initials = (text) => text.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

// Everything shown here comes from the API (admin-entered). Empty fields are hidden.
export default function LeaderCard({ leader }) {
  return (
    <article className={`card card--leader leader fx fx-up fx-tint ${leader.level === 'head' ? 'leader--head' : ''}`}>
      <div className="leader__ring">
        <div className="leader__photo">
          {leader.photo ? <img src={leader.photo} alt={leader.name} loading="lazy" /> : initials(leader.name || '?')}
        </div>
      </div>
      <h3>{leader.name}</h3>
      <p className="leader__title">{leader.position}</p>
      {leader.bio && <p>{leader.bio}</p>}
      {leader.phone && <a className="leader__link" href={`tel:${leader.phone.replace(/\s+/g, '')}`}><LuPhone aria-hidden="true" />{leader.phone}</a>}
      {leader.email && <a className="leader__link" href={`mailto:${leader.email}`}><LuMail aria-hidden="true" />{leader.email}</a>}
    </article>
  );
}
