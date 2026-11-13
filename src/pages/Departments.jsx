import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import Button from '../components/Button.jsx';
import { Icon } from '../lib/icons.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { byOrder } from '../lib/arrange.js';
import './Departments.css';

// Heads of a ministry, in official order. Names come from the admin-entered leaders list.
export const headsOf = (leaders, slug) => (leaders ?? []).filter((l) => l.section === slug && l.level === 'head' && l.name).sort(byOrder);

export function LedBy({ heads }) {
  if (!heads.length) return null;
  return (
    <p className="ministry__lead">
      {heads.map((h, i) => (
        <span key={h.id}>{i > 0 && ' · '}<b>{h.name}</b> <small>({h.position})</small></span>
      ))}
    </p>
  );
}

export default function Departments() {
  const dp = useFetch(api.getDepartments);
  const ld = useFetch(api.getLeaders);
  return (
    <>
      <PageBanner title="Ministries and Departments" subtitle="Find where you can serve and grow" />
      <section className="section">
        <div className="container ministry-list">
          {dp.loading ? <Loader /> : dp.error ? <ErrorNotice onRetry={dp.reload} /> : dp.data.map((d) => (
            <article key={d.slug} className="card ministry fx fx-skew fx-tint">
              <Link to={`/departments/${d.slug}`} className="ministry__media" aria-label={d.name}><Icon name={d.icon} /></Link>
              <div className="ministry__body">
                <h3><Link to={`/departments/${d.slug}`}>{d.name}</Link></h3>
                <LedBy heads={headsOf(ld.data, d.slug)} />
                <p>{d.description}</p>
                {d.mission && <p className="ministry__mission"><b>Mission:</b> {d.mission}</p>}
                <Button to={`/departments/${d.slug}`} variant="outline" arrow>Discover more</Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
