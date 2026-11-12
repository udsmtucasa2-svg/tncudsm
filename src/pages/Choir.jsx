import { LuMusic } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import LeaderCard from '../components/LeaderCard.jsx';
import EventCard from '../components/EventCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Button from '../components/Button.jsx';
import Reveal from '../components/Reveal.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { byOrder, upcomingEvents } from '../lib/arrange.js';
import { choir } from '../data/site.js';

export default function Choir() {
  const ld = useFetch(api.getLeaders);
  const ev = useFetch(api.getEvents);
  const team = ld.data.filter((l) => l.section === 'music' && l.name).sort(byOrder);
  const events = upcomingEvents(ev.data.filter((e) => /music|choir|concert/i.test(`${e.department || ''} ${e.title || ''}`)));
  return (
    <>
      <PageBanner title="TNC Choir" subtitle="Praising God through song" />
      <section className="section">
        <div className="container container--text">
          <SectionHeading eyebrow="Music ministry" title="Lift your voice" />
          <p>{choir.intro}</p>
          <p>{choir.join}</p>
          <div className="center-row">
            <Button to="/register" variant="gold" arrow>Join TNC</Button>
            <Button to="/contact" variant="outline">Ask about the choir</Button>
            <Button to="/departments/music" variant="outline">Music ministry</Button>
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <SectionHeading eyebrow="Meet the team" title="Music leadership" />
            <div className="grid grid--3">{team.map((l) => <Reveal key={l.id}><LeaderCard leader={l} /></Reveal>)}</div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Listen live" title="Concerts and programmes" />
          {events.length === 0
            ? <EmptyState icon={LuMusic} title="No concerts announced yet">Follow the Events page for the next choir programme.</EmptyState>
            : <div className="cards">{events.map((e) => <EventCard key={e.id} e={e} />)}</div>}
        </div>
      </section>
    </>
  );
}
