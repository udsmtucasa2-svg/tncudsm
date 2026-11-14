import { Link } from 'react-router-dom';
import { LuArrowRight, LuPlus, LuTriangleAlert, LuRotateCcw, LuCalendarDays, LuInbox, LuCheck } from 'react-icons/lu';
import { useState } from 'react';
import { api, isLocalMode } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import { RESOURCES, REQUEST_TYPES } from './config.js';
import { todayISO, fmtDate, isVisible } from '../lib/arrange.js';

const KEYS = Object.keys(RESOURCES);

async function loadAll() {
  const lists = await Promise.all(KEYS.map((k) => api.admin.list(k)));
  return Object.fromEntries(KEYS.map((k, i) => [k, lists[i]]));
}

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
const isNew = (r) => (r.status || 'New') === 'New';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(loadAll, null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (loading) return <Loader />;
  if (error || !data) return <ErrorNotice onRetry={reload}>We could not load the dashboard.</ErrorNotice>;

  const today = todayISO();
  const emptySeats = data.leaders.filter((l) => !l.name).length;
  const waitingFamily = data.members.filter((m) => ['member', 'leader'].includes(m.category) && !m.familyId).length;
  const upcomingList = data.events.filter((e) => e.date >= today && e.published !== false).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const newRequests = data.requests.filter(isNew);
  const liveNotices = data.announcements.filter(isVisible).length;
  const latestRequests = [...data.requests].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 4);
  const first = (user?.name || '').split(' ')[0];

  const reset = async () => { await api.admin.reset(); setConfirmReset(false); reload(); };

  const todo = [
    newRequests.length > 0 && <li key="req"><b>{newRequests.length} new request{newRequests.length > 1 ? 's' : ''}</b> waiting for a reply. <Link to="/admin/requests">Open inbox</Link></li>,
    waitingFamily > 0 && <li key="fam"><b>{waitingFamily} student{waitingFamily > 1 ? 's' : ''}</b> not in a family yet. <Link to="/admin/families">Open families</Link></li>,
    emptySeats > 0 && <li key="seat"><b>{emptySeats} leader seat{emptySeats > 1 ? 's' : ''}</b> still need a name. They stay hidden on the website until filled. <Link to="/admin/leaders">Open leaders</Link></li>,
    upcomingList.length === 0 && <li key="ev">There are <b>no upcoming events</b>. Visitors will see an empty events list. <Link to="/admin/events">Add an event</Link></li>,
    liveNotices === 0 && <li key="an"><b>No announcements</b> are showing on the website. <Link to="/admin/announcements?new=1">Add an announcement</Link></li>,
  ].filter(Boolean);

  return (
    <>
      <div className="adm-head">
        <div><h1>{greeting()}{first ? `, ${first}` : ''}</h1><p>Everything on the TNC UDSM website is managed from here.</p></div>
      </div>

      {todo.length > 0 && (
        <div className="adm-todo">
          <LuTriangleAlert aria-hidden="true" />
          <ul>{todo}</ul>
        </div>
      )}

      <div className="adm-stats">
        {KEYS.map((k) => {
          const r = RESOURCES[k];
          const Icon = r.icon;
          return (
            <Link key={k} to={`/admin/${k}`} className="adm-stat">
              <span className="adm-stat__icon"><Icon aria-hidden="true" /></span>
              <span className="adm-stat__num">{data[k].length}</span>
              <span className="adm-stat__label">{r.label}</span>
              {k === 'requests' && newRequests.length > 0 && <span className="adm-stat__new">{newRequests.length} new</span>}
              <LuArrowRight className="adm-stat__go" aria-hidden="true" />
            </Link>
          );
        })}
      </div>

      <div className="adm-dash">
        <section className="adm-card">
          <div className="adm-card__head"><h2><LuCalendarDays aria-hidden="true" />Coming up</h2><Link to="/admin/events">All events</Link></div>
          {upcomingList.length === 0 ? (
            <p className="adm-muted">No upcoming events yet.</p>
          ) : (
            <ul className="adm-list">
              {upcomingList.slice(0, 4).map((e) => (
                <li key={e.id}>
                  <span className="adm-list__date"><b>{new Date(`${e.date}T00:00:00`).getDate()}</b>{fmtDate(e.date, { month: 'short' })}</span>
                  <span className="adm-list__body"><b>{e.title}</b><small>{[e.time, e.location].filter(Boolean).join(' · ')}</small></span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <div className="adm-card__head"><h2><LuInbox aria-hidden="true" />Latest requests</h2><Link to="/admin/requests">Open inbox</Link></div>
          {latestRequests.length === 0 ? (
            <p className="adm-muted">No requests or messages yet.</p>
          ) : (
            <ul className="adm-list">
              {latestRequests.map((r) => (
                <li key={r.id}>
                  <span className="adm-list__body"><b>{r.name || 'Anonymous'} <em>{REQUEST_TYPES[r.type] || r.type}</em></b><small>{(r.message || '').slice(0, 90) || 'No message'}</small></span>
                  <span className={`adm-pill adm-pill--${isNew(r) ? 'warn' : r.status === 'Done' ? 'ok' : 'muted'}`}>{r.status || 'New'}</span>
                </li>
              ))}
            </ul>
          )}
          {newRequests.length === 0 && latestRequests.length > 0 && <p className="adm-allclear"><LuCheck aria-hidden="true" />All caught up</p>}
        </section>
      </div>

      <div className="adm-card">
        <h2>Quick actions</h2>
        <div className="adm-actions adm-actions--grid">
          {['announcements', 'events', 'sermons', 'gallery'].map((k) => (
            <Link key={k} to={`/admin/${k}?new=1`} className="adm-btn adm-btn--ghost"><LuPlus aria-hidden="true" />New {RESOURCES[k].singular.toLowerCase()}</Link>
          ))}
        </div>
      </div>

      {isLocalMode && (
        <div className="adm-card">
          <h2>Preview data</h2>
          <p className="adm-muted">Content in local preview mode lives in this browser. Reset it to go back to the starting content.</p>
          {confirmReset ? (
            <div className="adm-actions">
              <button className="adm-btn adm-btn--danger" onClick={reset}>Yes, reset everything</button>
              <button className="adm-btn adm-btn--ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
            </div>
          ) : (
            <button className="adm-btn adm-btn--ghost" onClick={() => setConfirmReset(true)}><LuRotateCcw aria-hidden="true" />Reset preview data</button>
          )}
        </div>
      )}
    </>
  );
}