import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { LuChevronDown, LuMenu, LuX, LuUser, LuLayoutDashboard } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext.jsx';
import { NAV } from '../data/navigation.js';

// Both logos are always rendered (never hidden by breakpoint) so the brand is visible on every screen.
// No card sits behind them. The SDA logo is drawn as a one-colour overlay: teal on light
// backgrounds (tone="teal", the default) and white on dark ones (tone="white", e.g. the footer).
// The PCM logo is always shown exactly as it is.
export function BrandLogos({ size = 'md', tone = 'teal' }) {
  return (
    <span className={`logos logos--${size} logos--${tone}`}>
      <span className="logo-sda" role="img" aria-label="Seventh-day Adventist Church logo" />
      <img src="/images/pcm-logo.png" alt="Public Campus Ministries logo" width="228" height="268" />
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isAdmin } = useAuth();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const link = ({ isActive }) => `nav__link ${isActive ? 'active' : ''}`;
  const groupActive = (g) => g.children.some((c) => pathname === c.to || pathname.startsWith(`${c.to}/`));
  const profileTo = user ? (isAdmin ? '/admin' : '/dashboard') : '/login';

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label="TNC UDSM home">
          <BrandLogos />
          <span className="nav__name">TUCASA<small>Nyerere Campus UDSM</small></span>
        </Link>

        <nav className={`nav__links ${open ? 'open' : ''}`} aria-label="Main">
          {NAV.map((item) => (item.children ? (
            <div className="nav__item" key={item.label}>
              <span className={`nav__link ${groupActive(item) ? 'active' : ''}`} tabIndex={0} role="button" aria-haspopup="true">
                {item.label} <LuChevronDown className="nav__chev" aria-hidden="true" />
              </span>
              <div className="nav__dropdown">
                {item.children.map((c) => <NavLink key={c.to} to={c.to} className={({ isActive }) => (isActive ? 'active' : '')}>{c.label}</NavLink>)}
              </div>
            </div>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.end} className={link}>{item.label}</NavLink>
          )))}

          {/* Only visible inside the phone menu */}
          <div className="nav__mobile-extra">
            {!user && <Link to="/register" className="btn btn--gold btn--block"><span>Join TNC</span></Link>}
            <Link to={profileTo} className="btn btn--outline btn--block"><span>{user ? 'My Profile' : 'Member Login'}</span></Link>
          </div>
        </nav>

        <div className="nav__right">
          {isAdmin && (
            <Link to="/admin" className="nav__admin" title="Open admin panel"><LuLayoutDashboard aria-hidden="true" /><span>Admin</span></Link>
          )}
          {!user && <Link to="/register" className="btn btn--gold nav__cta"><span>Join TNC</span></Link>}
          <Link to={profileTo} className="nav__user" aria-label={user ? `My Profile (${user.name})` : 'Member Login'} title={user ? `My Profile (${user.name})` : 'Member Login'}>
            {user ? <span className="nav__initial">{user.name?.[0]?.toUpperCase()}</span> : <LuUser aria-hidden="true" />}
          </Link>
          <button className="nav__toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
