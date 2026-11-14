import { LuNewspaper } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Reveal from '../components/Reveal.jsx';
import AnnouncementCard from '../components/AnnouncementCard.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { newestFirst } from '../lib/arrange.js';
import './News.css';

export default function News() {
  const { data, loading, error, reload } = useFetch(api.getAnnouncements);
  const list = newestFirst(data);
  return (
    <>
      <PageBanner title="News & Announcements" subtitle="What is happening in our fellowship" />
      <section className="section">
        <div className="container">
          {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload} /> : list.length === 0 ? (
            <EmptyState icon={LuNewspaper} title="No announcements yet">News and notices will be posted here.</EmptyState>
          ) : (
            <div className="hrow hrow--notices hrow--wrap">
              {list.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 80} className="hrow__item">
                  <AnnouncementCard a={a} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}