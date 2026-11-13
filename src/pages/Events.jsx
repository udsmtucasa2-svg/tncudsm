import { LuCalendarX } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import EventCard from '../components/EventCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { upcomingEvents, pastEvents } from '../lib/arrange.js';
import './Events.css';

export default function Events() {
  const { data, loading, error, reload } = useFetch(api.getEvents);
  const upcoming = upcomingEvents(data);
  const past = pastEvents(data);
  return (
    <>
      <PageBanner title="Events" subtitle="Worship, concerts and fellowship" />
      <section className="section">
        <div className="container">
          {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload} /> : (
            <>
              {upcoming.length === 0 && <EmptyState icon={LuCalendarX} title="No upcoming events yet">Please check back soon.</EmptyState>}
              {upcoming.length > 0 && <div className="cards">{upcoming.map((e) => <EventCard key={e.id} e={e} />)}</div>}
              {past.length > 0 && (
                <>
                  <h2 className="leader-section__title past-title">Past events</h2>
                  <div className="cards">{past.map((e) => <EventCard key={e.id} e={e} past />)}</div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
