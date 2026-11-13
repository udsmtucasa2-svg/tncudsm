import { useState } from 'react';
import { LuArrowRight, LuLibrary } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import './Resources.css';

export default function Resources() {
  const { data, loading, error, reload } = useFetch(api.getResources);
  const [type, setType] = useState('All');
  const types = ['All', ...new Set(data.map((r) => r.type).filter(Boolean))];
  const list = data.filter((r) => type === 'All' || r.type === type);

  return (
    <>
      <PageBanner title="TNC Library" subtitle="Readings, study guides and more" />
      <section className="section">
        <div className="container">
          {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload} /> : data.length === 0 ? (
            <EmptyState icon={LuLibrary} title="No resources yet">Study guides and readings will be shared here.</EmptyState>
          ) : (
            <>
              <div className="tabs">{types.map((t) => <button key={t} className={`tab ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>)}</div>
              <div className="grid grid--3">
                {list.map((r) => (
                  <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="card card--resource fx fx-split fx-navy">
                    <span className="badge">{r.type}</span>
                    <h3>{r.title}</h3>
                    <span className="card__more">Open <LuArrowRight aria-hidden="true" /></span>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
