import { useState, useEffect } from 'react';
import { Navigate, NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { LuLayoutDashboard, LuLogOut, LuMenu, LuX, LuGlobe, LuShieldAlert, LuInfo } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext.jsx';
import { isLocalMode } from '../services/api.js';
import { BrandLogos } from '../components/Navbar.jsx';
import Loader from '../components/Loader.jsx';
import Button from '../components/Button.jsx';
import { RESOURCES, NAV_GROUPS } from './config.js';
import './admin.css';

export default function AdminLayout() {
  const { user, ready, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);

  if (!ready) return <div className="adm-center"><Loader /></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="adm-center">
        <div className="adm-denied">
          <LuShieldAlert aria-hidden="true" />
          <h1>Access denied</h1>
          <p>Your account does not have permission to manage this website.</p>
          <div className="adm-denied__row"><Button to="/">Back to website</Button><Button variant="outline" onClick={logout}>Sign out</Button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm">
      <aside className={`adm__side ${open ? 'open' : ''}`}>
        <Link to="/admin" className="adm__brand"><BrandLogos tone="white" /><span>TNC UDSM<small>Admin panel</small></span></Link>
        <nav aria-label="Admin">
          <NavLink to="/admin" end className="adm__link"><LuLayoutDashboard aria-hidden="true" />Dashboard</NavLink>
          {NAV_GROUPS.map((g) => (
            <div key={g.label} className="adm__group">
              <p>{g.label}</p>
              {g.keys.map((k) => {
                const Icon = RESOURCES[k].icon;
                return <NavLink key={k} to={`/admin/${k}`} className="adm__link"><Icon aria-hidden="true" />{RESOURCES[k].label}</NavLink>;
              })}
            </div>
          ))}
        </nav>
        <div className="adm__side-foot">
          <Link to="/" className="adm__link"><LuGlobe aria-hidden="true" />View website</Link>
        </div>
      </aside>
      {open && <button className="adm__scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}

      <div className="adm__main">
        <header className="adm__top">
          <button className="adm__burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}</button>
          <div className="adm__user">
            <span className="adm__avatar">{user.name?.[0]?.toUpperCase()}</span>
            <span className="adm__who"><b>{user.name}</b><small>{user.email || "Administrator"}</small></span>
            <button className="adm__out" onClick={logout} title="Sign out"><LuLogOut aria-hidden="true" /><span>Sign out</span></button>
          </div>
        </header>
        {isLocalMode && (
          <div className="adm__banner"><LuInfo aria-hidden="true" />Local preview mode: changes are saved in this browser only. Connect the backend (VITE_API_URL) to publish for everyone.</div>
        )}
        <main className="adm__content"><Outlet /></main>
      </div>
    </div>
  );
}
