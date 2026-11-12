import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LuX, LuChevronDown, LuChevronRight, LuUser, LuLogOut,
  LuHouse, LuInfo, LuNewspaper, LuCalendarDays, LuUsersRound, LuTrophy, LuGraduationCap,
  LuHandHelping, LuMusic, LuUsers, LuImage, LuMic, LuLibrary, LuMail, LuSparkles,
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext.jsx';
import { NAV } from '../data/navigation.js';
import { socials } from '../data/site.js';

// Items come from data/navigation.js. To give a new page an icon, add it to ICONS.
const ICONS = {
  '/': LuHouse, '/about': LuInfo, '/news': LuNewspaper, '/events': LuCalendarDays,
  '/families': LuUsersRound, '/sports': LuTrophy, '/alumni': LuGraduationCap,
  '/departments': LuHandHelping, '/choir': LuMusic, '/leadership': LuUsers,
  '/gallery': LuImage, '/sermons': LuMic, '/library': LuLibrary, '/contact': LuMail,
};
const GROUP_ICONS = { Community: LuUsersRound, More: LuSparkles };
const iconFor = (to) => ICONS[to] ?? LuChevronRight;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function MobileSidebar({ open, onClose, logo }) {
  const { pathname } = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [expanded, setExpanded] = useState({});
  const panel = useRef(null);
  const closeBtn = useRef(null);
  const lastFocus = useRef(null);
  const drag = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const inGroup = (g) => g.children.some((c) => pathname === c.to || pathname.startsWith(`${c.to}/`));

  // Each time the menu opens, unfold the group that contains the current page.
  useEffect(() => {
    if (open) setExpanded(Object.fromEntries(NAV.filter((n) => n.children && inGroup(n)).map((n) => [n.label, true])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Scroll lock, Escape to close, focus kept inside the panel, focus handed back on close.
  useEffect(() => {
    const el = panel.current;
    if (!el) return undefined;
    el.inert = !open;
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => closeBtn.current?.focus(), 80);
    const onKey = (e) => {
      if (e.key === 'Escape') { closeRef.current(); return; }
      if (e.key !== 'Tab') return;
      const items = [...el.querySelectorAll('a[href], button:not([disabled])')].filter((n) => getComputedStyle(n).visibility !== 'hidden');
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lastFocus.current?.focus?.();
    };
  }, [open]);

  // Resizing to desktop width closes the menu.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1021px)');
    const h = () => { if (mq.matches) closeRef.current(); };
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  // Swipe right to close.
  const onTouchStart = (e) => { const t = e.touches[0]; drag.current = { x: t.clientX, y: t.clientY, dx: 0, on: false }; };
  const onTouchMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const t = e.touches[0];
    const dx = t.clientX - d.x;
    const dy = t.clientY - d.y;
    if (!d.on) {
      if (dx > 10 && dx > Math.abs(dy) * 1.5) { d.on = true; panel.current.classList.add('is-dragging'); } else return;
    }
    d.dx = Math.max(0, dx);
    panel.current.style.transform = `translateX(${d.dx}px)`;
  };
  const onTouchEnd = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.on) return;
    panel.current.classList.remove('is-dragging');
    panel.current.style.transform = '';
    if (d.dx > 80) closeRef.current();
  };

  const profileTo = isAdmin ? '/admin' : '/dashboard';
  const liveSocials = socials.filter((s) => s.url && s.url !== '#');

  return createPortal(
    <div className={`sb ${open ? 'is-open' : ''}`}>
      <div className="sb__scrim" onClick={onClose} aria-hidden="true" />
      <aside
        id="mobile-sidebar" ref={panel} className="sb__panel" role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}
      >
        <div className="sb__top">
          <div className="sb__brand">{logo}</div>
          <button ref={closeBtn} type="button" className="sb__close" onClick={onClose} aria-label="Close menu"><LuX aria-hidden="true" /></button>
        </div>

        {user && (
          <Link to={profileTo} className="sb__user">
            <span className="sb__avatar">{user.name?.[0]?.toUpperCase() ?? <LuUser aria-hidden="true" />}</span>
            <span className="sb__who">
              <small>{isAdmin ? 'Open admin panel' : 'My profile'}</small>
              <b>{user.name}</b>
            </span>
            <LuChevronRight className="sb__who-go" aria-hidden="true" />
          </Link>
        )}

        <nav className="sb__nav" aria-label="Mobile">
          <ul>
            {NAV.map((item, idx) => {
              if (!item.children) {
                const I = iconFor(item.to);
                return (
                  <li key={item.to} style={{ '--i': idx }}>
                    <NavLink to={item.to} end={item.end} className={({ isActive }) => `sb__item ${isActive ? 'active' : ''}`}>
                      <span className="sb__ico"><I aria-hidden="true" /></span>{item.label}
                      <LuChevronRight className="sb__go" aria-hidden="true" />
                    </NavLink>
                  </li>
                );
              }
              const G = GROUP_ICONS[item.label] ?? LuChevronRight;
              const isOpen = !!expanded[item.label];
              const id = `sb-${slug(item.label)}`;
              return (
                <li key={item.label} style={{ '--i': idx }}>
                  <button type="button" className={`sb__item sb__toggle ${inGroup(item) ? 'active' : ''}`} aria-expanded={isOpen} aria-controls={id}
                    onClick={() => setExpanded((e) => ({ ...e, [item.label]: !e[item.label] }))}>
                    <span className="sb__ico"><G aria-hidden="true" /></span>{item.label}
                    <LuChevronDown className="sb__chev" aria-hidden="true" />
                  </button>
                  <div id={id} className={`sb__sub ${isOpen ? 'open' : ''}`}>
                    <ul>
                      {item.children.map((c) => {
                        const C = iconFor(c.to);
                        return (
                          <li key={c.to}>
                            <NavLink to={c.to} className={({ isActive }) => `sb__sublink ${isActive ? 'active' : ''}`}><C aria-hidden="true" />{c.label}</NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sb__foot">
          {!user && <Link to="/register" className="btn btn--gold btn--block"><span>Join TNC</span></Link>}
          {!user && <Link to="/login" className="btn btn--outline btn--block"><span>Member login</span></Link>}
          {user && (
            <button type="button" className="sb__signout" onClick={async () => { await logout(); onClose(); }}>
              <LuLogOut aria-hidden="true" />Sign out
            </button>
          )}
          {liveSocials.length > 0 && (
            <div className="sb__social">
              {liveSocials.map(({ name, url, Icon }) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name}><Icon aria-hidden="true" /></a>)}
            </div>
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}