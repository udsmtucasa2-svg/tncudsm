// Single data layer. Pages never talk to storage or fetch directly.
// - VITE_API_URL set   -> Django REST backend (public reads, /me/ for members, /manage/ for the admin).
// - VITE_API_URL empty -> local preview mode (src/services/store.js + localMembers.js).
// Role checks are enforced by the backend. The frontend only shows what the API returns.
import { store, imageToDataUrl, fileToDataUrl } from './store.js';
import { local } from './localMembers.js';
import { isVisible } from '../lib/arrange.js';

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
export const isLocalMode = !BASE;

async function request(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: isForm ? options.headers : { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.detail || ''; } catch { /* not json */ }
    const err = new Error(detail || (res.status === 401 || res.status === 403 ? 'You do not have access to this.' : `Request failed (${res.status})`));
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });
const upload = async (path, file) => { const body = new FormData(); body.append('file', file); return (await request(path, { method: 'POST', body })).url; };

// ---- Public reads ----
// Announcements, events and sermons the admin has hidden (or let expire) never reach the public pages.
// The backend should filter these too; this is a safety net for the preview and for old data.
const HIDEABLE = ['announcements', 'events', 'sermons'];
const publicList = async (name) => {
  const rows = BASE ? await request(`/${name}/`) : await store.list(name);
  if (!BASE && name === 'leaders') return rows.filter((l) => l.published !== false && l.name);
  if (HIDEABLE.includes(name)) return rows.filter(isVisible);
  return rows;
};

// ---- Auth (session) ----
const LOCAL_ADMIN_EMAIL = 'admin@tncudsm.com';
const SESSION_KEY = 'tnc-local-session';
const readSession = () => { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; } };
const writeSession = (u) => { try { u ? sessionStorage.setItem(SESSION_KEY, JSON.stringify(u)) : sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ } };

const auth = {
  me: async () => {
    if (BASE) { try { return await request('/auth/me/'); } catch { return null; } }
    return readSession();
  },
  // identifier = phone number or email. role = member | alumni | associate (the admin signs in at /admin/login).
  login: async ({ identifier, email, password, role }) => {
    const who = (identifier ?? email ?? '').trim();
    if (BASE) return request('/auth/login/', json('POST', { identifier: who, email: who, password, role }));
    if (who.toLowerCase() === LOCAL_ADMIN_EMAIL) {
      if (password !== (import.meta.env.VITE_LOCAL_ADMIN_PASSWORD || 'admin123')) throw new Error('Incorrect email or password.');
      const user = { name: 'Administrator', email: who, role: 'admin' };
      writeSession(user);
      return user;
    }
    const user = await local.login({ identifier: who, password, role });
    writeSession(user);
    return user;
  },
  register: async (data) => {
    if (BASE) return request('/auth/register/', json('POST', data));
    const user = await local.register(data);
    writeSession(user);
    return user;
  },
  logout: async () => {
    if (BASE) { try { await request('/auth/logout/', { method: 'POST' }); } catch { /* ignore */ } }
    writeSession(null);
  },
};

// ---- The signed-in member's own profile ----
const member = {
  get: () => (BASE ? request('/me/') : local.me(readSession()?.id)),
  update: (patch) => (BASE ? request('/me/', json('PATCH', patch)) : local.updateMe(readSession()?.id, patch)),
  uploadPhoto: (file) => (BASE ? upload('/me/photo/', file) : imageToDataUrl(file, 600)),
};

// ---- Admin ----
const admin = {
  list: (name) => {
    if (BASE) return request(`/manage/${name}/`);
    if (name === 'members') return local.listMembers();
    if (name === 'families') return local.listFamilies();
    return store.list(name);
  },
  create: (name, item) => (BASE ? request(`/manage/${name}/`, json('POST', item)) : store.create(name, item)),
  update: (name, id, item) => {
    if (BASE) return request(`/manage/${name}/${id}/`, json('PATCH', item));
    if (name === 'members') return local.updateMember(id, item);
    return store.update(name, id, item);
  },
  remove: (name, id) => {
    if (BASE) return request(`/manage/${name}/${id}/`, { method: 'DELETE' });
    if (name === 'members') return local.removeMember(id);
    return store.remove(name, id);
  },
  reset: () => (BASE ? Promise.reject(new Error('Not available when a backend is connected')) : store.reset()),
  upload: async (file) => (BASE ? upload('/manage/uploads/', file) : imageToDataUrl(file)),
  uploadPdf: async (file) => (BASE ? upload('/manage/uploads/', file) : fileToDataUrl(file)),

  // Families and graduation
  previewFamilies: (size) => (BASE ? request('/manage/families/preview/', json('POST', { size })) : local.previewFamilies({ size })),
  applyFamilies: (families) => (BASE ? request('/manage/families/apply/', json('POST', { families })) : local.applyFamilies(families)),
  renameFamily: (id, name) => (BASE ? request(`/manage/families/${id}/`, json('PATCH', { name })) : local.renameFamily(id, name)),
  assignUnassigned: () => (BASE ? request('/manage/families/assign-unassigned/', { method: 'POST' }) : local.assignUnassigned()),
  syncGraduations: () => (BASE ? request('/manage/members/sync-graduations/', { method: 'POST' }) : local.syncGraduations()),
  addSampleMembers: (n) => (BASE ? Promise.reject(new Error('Sample members are only for local preview')) : local.addSamples(n)),
};

// ---- Visitor requests (Bible study, prayer, contact). Anyone may submit; only the admin can read them. ----
const submitRequest = async (payload) => {
  if (payload.website) return { ok: true }; // honeypot: bots fill the hidden field, people never see it
  const clean = Object.fromEntries(Object.entries(payload).filter(([k]) => k !== 'website'));
  if (BASE) return request('/requests/', json('POST', clean));
  return store.create('requests', { ...clean, status: 'New', createdAt: new Date().toISOString() });
};

export const api = {
  getDepartments: () => publicList('departments'),
  getLeaders: () => publicList('leaders'),
  getEvents: () => publicList('events'),
  getSermons: () => publicList('sermons'),
  getResources: () => publicList('resources'),
  getGallery: () => publicList('gallery'),
  getServices: () => publicList('services'),
  getAnnouncements: () => publicList('announcements'),
  getSports: () => publicList('sports'),
  // Public: family names only. Members of a family are never exposed here.
  getFamilies: async () => (await publicList('families')).map((f) => ({ id: f.id, name: f.name })),
  submitRequest,
  ...auth,
  member,
  admin,
};