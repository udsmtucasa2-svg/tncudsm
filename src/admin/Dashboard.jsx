import { Link } from 'react-router-dom';
import { LuArrowRight, LuPlus, LuTriangleAlert, LuRotateCcw } from 'react-icons/lu';
import { useState } from 'react';
import { api, isLocalMode } from '../services/api.js';
import { useFetch } from '../hooks.js';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import { RESOURCES } from './config.js';
import { todayISO } from '../lib/arrange.js';

const KEYS = Object.keys(RESOURCES);

async function loadAll() {
  const lists = await Promise.all(KEYS.map((k) => api.admin.list(k)));
  return Object.fromEntries(KEYS.map((k, i) => [k, lists[i]]));
}

export default function Dashboard() {
  const { data, loading, error, reload } = useFetch(loadAll, null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (loading) return <Loader />;
  if (error || !data) return <ErrorNotice onRetry={reload}>We could not load the dashboard.</ErrorNotice>;

  const emptySeats = data.leaders.filter((l) => !l.name).length;
  const waitingFamily = data.members.filter((m) => ['member', 'leader'].includes(m.category) && !m.familyId).length;
  const upcoming = data.events.filter((e) => e.date >= todayISO()).length;

  const reset = async () => { await api.admin.reset(); setConfirmReset(false); reload(); };

  return (
    <>
      <div className="adm-head">
        <div><h1>Dashboard</h1><p>Everything on the TNC UDSM website is managed from here.</p></div>
      </div>

      {(emptySeats > 0 || upcoming === 0 || waitingFamily > 0) && (
        <div className="adm-todo">
          <LuTriangleAlert aria-hidden="true" />
          <ul>
            {waitingFamily > 0 && <li><b>{waitingFamily} student{waitingFamily > 1 ? 's' : ''}</b> not in a family yet. <Link to="/admin/families">Open families</Link></li>}
            {emptySeats > 0 && <li><b>{emptySeats} leader seats</b> still need a name. They stay hidden on the website until filled. <Link to="/admin/leaders">Open leaders</Link></li>}
            {upcoming === 0 && <li>There are <b>no upcoming events</b>. Visitors will see an empty events list. <Link to="/admin/events">Add an event</Link></li>}
          </ul>
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
              <LuArrowRight className="adm-stat__go" aria-hidden="true" />
            </Link>
          );
        })}
      </div>

      <div className="adm-card">
        <h2>Quick actions</h2>
        <div className="adm-actions">
          {['events', 'sermons', 'announcements', 'gallery'].map((k) => (
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
