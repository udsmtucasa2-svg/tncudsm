import { Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import Button from '../components/Button.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import Reveal from '../components/Reveal.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import EventCard from '../components/EventCard.jsx';
import SermonCard from '../components/SermonCard.jsx';
import WorshipTimes from '../components/home/WorshipTimes.jsx';
import AboutTabs from '../components/home/AboutTabs.jsx';
import ContactSocial from '../components/home/ContactSocial.jsx';
import QuickActions from '../components/home/QuickActions.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Icon } from '../lib/icons.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { newestFirst, upcomingEvents, fmtDate } from '../lib/arrange.js';
import './Home.css';

// Home page order: hero, worship times, about, ministries, events, sermons and notices, join, contact.
// Events, sermons and notices only appear when the admin has added them, so the page never shows filler.
export default function Home() {
  const { user } = useAuth();
  const ev = useFetch(api.getEvents);
  const se = useFetch(api.getSermons);
  const an = useFetch(api.getAnnouncements);
  const dp = useFetch(api.getDepartments);

  const upcoming = upcomingEvents(ev.data).slice(0, 3);
  const sermons = newestFirst(se.data).slice(0, 3);
  const notices = newestFirst(an.data).slice(0, 3);

  // Sections alternate white / light-grey in the order they appear, so the page rhythm never breaks
  // even when events, sermons or notices are missing.
  let n = 0;
  // Every section after the first also gets a wave edge (see .wave-top in styles/base.css).
  const tone = () => { const i = n++; return `${i % 2 ? 'section--soft' : ''} ${i > 0 ? 'wave-top' : ''}`.trim(); };

  return (
    <>
      <HeroSlider />
      <WorshipTimes />
      <AboutTabs tone={tone()} />
      <QuickActions tone={tone()} />

      <section className={`section ${tone()}`}>
        <div className="container">
          <SectionHeading eyebrow="What we do" title="Our Ministries" />
          {dp.loading ? <Loader /> : dp.error ? <ErrorNotice onRetry={dp.reload} /> : (
            <div className="grid grid--3">
              {dp.data.slice(0, 6).map((d, i) => (
                <Reveal key={d.slug} delay={(i % 3) * 80}>
                  <Link to={`/departments/${d.slug}`} className="card card--tile mcard fx fx-skew fx-teal">
                    <span className="icon-tile"><Icon name={d.icon} /></span>
                    <h3>{d.name}</h3>
                    <p>{d.short}</p>
                    <span className="card__more">Meet the team <LuArrowRight aria-hidden="true" /></span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
          <div className="section-link"><Button to="/departments" variant="outline" arrow>All ministries</Button></div>
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className={`section ${tone()}`}>
          <div className="container">
            <SectionHeading eyebrow="Mark your calendar" title="Upcoming Events" />
            <div className="cards">{upcoming.map((e, i) => <Reveal key={e.id} delay={i * 80}><EventCard e={e} compact /></Reveal>)}</div>
            <div className="section-link"><Button to="/events" variant="outline" arrow>All events</Button></div>
          </div>
        </section>
      )}

      {(sermons.length > 0 || notices.length > 0) && (
        <section className={`section ${tone()}`}>
          <div className="container">
            {sermons.length > 0 && (
              <>
                <SectionHeading eyebrow="Listen" title="Latest Sermons" />
                <div className="cards">{sermons.map((s, i) => <Reveal key={s.id} delay={i * 80}><SermonCard s={s} /></Reveal>)}</div>
                <div className="section-link"><Button to="/sermons" variant="outline" arrow>All sermons</Button></div>
              </>
            )}
            {notices.length > 0 && (
              <div className={sermons.length ? 'home-notices' : ''}>
                <SectionHeading eyebrow="Notice board" title="Announcements" />
                <div className="grid grid--3">
                  {notices.map((a) => (
                    <Reveal key={a.id}>
                      <article className="card notice-card fx fx-side fx-tint">
                        <span className="badge">{fmtDate(a.date, { day: 'numeric', month: 'short' })}</span>
                        <h3>{a.title}</h3>
                        <p>{a.text}</p>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {!user && (
        <section className="join wave-top">
          <div className="container join__inner">
            <div>
              <h2>Become part of the family</h2>
              <p>Create an account to join a family and stay connected.</p>
            </div>
            <div className="join__actions">
              <Button to="/register" variant="gold" arrow>Join TNC</Button>
              <Button to="/login" variant="light">Member Login</Button>
            </div>
          </div>
        </section>
      )}

      <ContactSocial />
    </>
  );
}