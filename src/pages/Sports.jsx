import { LuTrophy, LuClock, LuMapPin } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';

export default function Sports() {
  const { data, loading, error, reload } = useFetch(api.getSports);
  return (
    <>
      <PageBanner title="Sports & Recreation" subtitle="Healthy bodies, joyful fellowship" />
      <section className="section">
        <div className="container">
          <p className="lead">Fellowship does not stop at the church door. Sports and recreation help us rest, make friends and care for the body God gave us. Everyone is welcome, whatever your level.</p>
          {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload} /> : data.length === 0 ? (
            <EmptyState icon={LuTrophy} title="Activities will be announced soon">Check the Events and News pages for the next sports day.</EmptyState>
          ) : (
            <div className="grid grid--3">
              {data.map((s, i) => (
                <Reveal key={s.id} delay={(i % 3) * 80}>
                  <article className="card fx fx-up fx-tint sports__card">
                    <span className="icon-tile"><LuTrophy aria-hidden="true" /></span>
                    <h3>{s.name}</h3>
                    {s.description && <p>{s.description}</p>}
                    <ul className="facts-inline">
                      <li><LuClock aria-hidden="true" />{[s.day, s.time].filter(Boolean).join(', ')}</li>
                      {s.venue && <li><LuMapPin aria-hidden="true" />{s.venue}</li>}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
          <div className="section-link"><Button to="/events" variant="outline" arrow>See upcoming events</Button></div>
        </div>
      </section>
    </>
  );
}
