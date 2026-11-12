import { LuNewspaper } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Reveal from '../components/Reveal.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { newestFirst, fmtDate } from '../lib/arrange.js';

export default function News() {
  const { data, loading, error, reload } = useFetch(api.getAnnouncements);
  const list = newestFirst(data);
  return (
    <>
      <PageBanner title="News & Announcements" subtitle="What is happening in our fellowship" />
      <section className="section">
        <div className="container container--text">
          {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload} /> : list.length === 0 ? (
            <EmptyState icon={LuNewspaper} title="No announcements yet">News and notices will be posted here.</EmptyState>
          ) : (
            <div className="news">
              {list.map((a) => (
                <Reveal key={a.id}>
                  <article className="card news__item fx fx-side fx-tint">
                    <span className="badge">{fmtDate(a.date)}</span>
                    <h3>{a.title}</h3>
                    <p>{a.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
