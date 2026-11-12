import { useSearchParams } from 'react-router-dom';
import { LuUsers } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import LeaderCard from '../components/LeaderCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { sections } from '../data/leadershipStructure.js';
import { byOrder } from '../lib/arrange.js';

export default function Leadership() {
  const [params, setParams] = useSearchParams();
  const group = params.get('group') || 'all';
  const { data: leaders, loading, error, reload } = useFetch(api.getLeaders);

  // Sections follow the official list order; people inside a section follow the admin's `order`.
  const known = new Set(sections.map((s) => s.key));
  const all = [...sections, { key: 'other', label: 'Other Leaders' }]
    .map((s) => ({
      ...s,
      people: leaders.filter((l) => l.name && (s.key === 'other' ? !known.has(l.section) : l.section === s.key)).sort(byOrder),
    }))
    .filter((s) => s.people.length > 0);
  const shown = group === 'all' ? all : all.filter((s) => s.key === group);

  return (
    <>
      <PageBanner title="Leadership" subtitle="The people serving TNC UDSM this term" />
      <section className="section">
        <div className="container">
          {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload} /> : all.length === 0 ? (
            <EmptyState icon={LuUsers} title="Leadership list coming soon">The 2026/2027 leaders will be published here.</EmptyState>
          ) : (
            <>
              <div className="tabs" role="tablist">
                <button className={`tab ${group === 'all' ? 'active' : ''}`} onClick={() => setParams({})}>All</button>
                {all.map((s) => (
                  <button key={s.key} className={`tab ${group === s.key ? 'active' : ''}`} onClick={() => setParams({ group: s.key })}>{s.label}</button>
                ))}
              </div>
              {shown.map((s) => (
                <div key={s.key} className="leader-section">
                  <h2 className="leader-section__title">{s.label}</h2>
                  <div className="grid grid--3">{s.people.map((l) => <LeaderCard key={l.id} leader={l} />)}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
