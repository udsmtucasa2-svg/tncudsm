import { LuMic } from 'react-icons/lu';
import SermonCard from '../components/SermonCard.jsx';
import PageBanner from '../components/PageBanner.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { newestFirst } from '../lib/arrange.js';

export default function Sermons() {
  const { data, loading, error, reload } = useFetch(api.getSermons);
  return (
    <>
      <PageBanner title="Sermons" subtitle="Listen, learn and be encouraged" />
      <section className="section">
        <div className="container">
          {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload} /> : data.length === 0 ? (
            <EmptyState icon={LuMic} title="No sermons published yet">New messages will appear here after they are uploaded.</EmptyState>
          ) : (
            <div className="cards">
              {newestFirst(data).map((s) => (
                <SermonCard key={s.id} s={s} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
