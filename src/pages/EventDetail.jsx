import { useParams, Link } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import { EventFacts } from '../components/EventCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';

export default function EventDetail() {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(api.getEvents);
  if (loading) return <section className="section container"><Loader /></section>;
  if (error) return <section className="section container"><ErrorNotice onRetry={reload} /></section>;
  const e = data.find((x) => String(x.id) === String(id));
  if (!e) return <section className="section container center-text"><h2>Event not found</h2><Link to="/events" className="card__more"><LuArrowLeft aria-hidden="true" /> All events</Link></section>;

  return (
    <>
      <PageBanner title={e.title} subtitle="Event details" />
      <section className="section">
        <div className="container detail">
          <div>
            {e.image && <img className="detail__img" src={e.image} alt={e.title} />}
            {e.description && <div className="detail__text"><h2>About this event</h2><p>{e.description}</p></div>}
          </div>
          <aside className="detail__panel"><h2>Event information</h2><EventFacts e={e} /></aside>
        </div>
        <div className="container back-row"><Link to="/events" className="card__more"><LuArrowLeft aria-hidden="true" /> All events</Link></div>
      </section>
    </>
  );
}
