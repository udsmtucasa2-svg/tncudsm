// Local preview implementation of the member system (registration, login, profile, families,
// graduation). In live mode the backend does all of this; see backend-reference/ADMIN_API.md.
import { store } from './store.js';
import { academicStart, graduationYearFor, hasFinished, isStudent, currentYearOfStudy, normEmail, normPhone, parseIdentifier, catLabel } from '../lib/members.js';
import { generateFamilies, pickFamilyFor, familyName } from '../lib/families.js';

const strip = ({ passwordHash, ...rest }) => rest;

// Preview only: a salted SHA-256. The real backend must use a proper password hasher.
async function hash(email, password) {
  const data = new TextEncoder().encode(`tnc:${email.trim().toLowerCase()}:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Students who have finished become Alumni and leave their family.
function graduate(state, now = new Date()) {
  let moved = 0;
  state.members.forEach((m) => {
    if (hasFinished(m, now)) {
      m.category = 'alumni';
      m.familyId = null;
      m.graduatedAt = now.toISOString().slice(0, 10);
      moved += 1;
    }
  });
  return moved;
}

function autoAssign(state, member) {
  if (!isStudent(member) || member.approved === false || member.familyId || !state.families.length) return;
  const f = pickFamilyFor(member, state.families, state.members);
  if (f) member.familyId = f.id;
}

// A member is a leader when their email matches a leader the admin added (Admin > Leaders).
// Nobody can register as a leader: the admin's list is the only source.
function leaderInfo(state, email) {
  const key = normEmail(email);
  const l = key ? state.leaders.find((x) => normEmail(x.email) === key) : null;
  return l ? { isLeader: true, leaderPosition: l.position || '', leaderSection: l.section || '' } : { isLeader: false, leaderPosition: '', leaderSection: '' };
}
const sessionUser = (state, m) => ({ id: m.id, name: m.fullName || m.email || m.phone || 'Member', email: m.email, phone: m.phone, role: 'member', category: m.category, ...leaderInfo(state, m.email) });

// Same key whichever way the phone is typed, so the password hash always matches.
const idKey = (id) => (id.type === 'phone' ? `p${normPhone(id.value)}` : id.value);

const nextId = (list) => list.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
const withDetails = (state, m) => {
  const fam = state.families.find((f) => f.id === m.familyId);
  const now = new Date();
  return {
    ...strip(m),
    ...leaderInfo(state, m.email),
    family: fam ? {
      id: fam.id,
      name: fam.name,
      members: state.members.filter((x) => x.familyId === fam.id).map((x) => ({ id: x.id, fullName: x.fullName, gender: x.gender, photo: x.photo, program: x.program, year: currentYearOfStudy(x, now) })),
    } : null,
  };
};

export const local = {
  // Sign-up needs only: role, phone number or email, password and year (year of study, or year completed for alumni).
  // Everything else is completed from the dashboard after the first login.
  async register(d) {
    const id = parseIdentifier(d.identifier);
    if (!id) throw new Error('Enter a valid phone number or email.');
    const email = id.type === 'email' ? id.value : '';
    const phone = id.type === 'phone' ? id.value : '';
    const passwordHash = await hash(idKey(id), d.password);
    const now = new Date();
    return store.transact((state) => {
      if (state.members.some((m) => (email && m.email === email) || (phone && m.phone && normPhone(m.phone) === normPhone(phone)))) throw new Error('An account with this phone number or email already exists.');
      const rec = {
        id: nextId(state.members), category: d.category, fullName: '', gender: '', address: '',
        baptized: false, baptizedChurch: '', phone, email, photo: null,
        passwordHash, approved: true, familyId: null, createdAt: now.toISOString().slice(0, 10),
      };
      if (d.category === 'member') {
        Object.assign(rec, { institution: 'University of Dar es Salaam', program: '', programDuration: null, yearOfStudy: Number(d.yearOfStudy), signupAcademicStart: academicStart(now), graduationYear: null });
      }
      if (d.category === 'alumni') Object.assign(rec, { program: '', graduationYear: Number(d.completionYear) || null });
      if (d.category === 'associate') rec.organisation = '';
      state.members.push(rec);
      return sessionUser(state, rec);
    });
  },

  async login({ identifier, password, role }) {
    const id = parseIdentifier(identifier);
    if (!id) throw new Error('Enter the phone number or email you registered with.');
    const passwordHash = await hash(idKey(id), password);
    return store.transact((state) => {
      graduate(state);
      const m = state.members.find((x) => (id.type === 'email' ? x.email === id.value : x.phone && normPhone(x.phone) === normPhone(id.value)) && x.passwordHash === passwordHash);
      if (!m) throw new Error('Incorrect phone, email or password.');
      const mine = m.category === 'leader' ? 'member' : m.category;
      if (role && mine !== role) throw new Error(`This account is registered as ${catLabel(mine)}. Choose "${catLabel(mine)}" above and try again.`);
      return sessionUser(state, m);
    });
  },

  me: (id) => store.transact((state) => {
    graduate(state);
    const m = state.members.find((x) => String(x.id) === String(id));
    if (!m) throw new Error('Member not found');
    return withDetails(state, m);
  }),

  updateMe: (id, patch) => store.transact((state) => {
    const m = state.members.find((x) => String(x.id) === String(id));
    if (!m) throw new Error('Member not found');
    const allowed = ['fullName', 'gender', 'address', 'phone', 'email', 'photo', 'baptized', 'baptizedChurch', 'program', 'institution', 'organisation'];
    allowed.forEach((k) => { if (k in patch) m[k] = patch[k]; });
    if ('email' in patch) {
      m.email = normEmail(patch.email);
      if (m.email && state.members.some((x) => x.id !== m.id && x.email === m.email)) throw new Error('Another account already uses this email.');
    }
    if (!m.baptized) m.baptizedChurch = '';
    if (isStudent(m) && (patch.yearOfStudy || patch.programDuration)) {
      m.yearOfStudy = Number(patch.yearOfStudy ?? currentYearOfStudy(m));
      m.programDuration = Number(patch.programDuration ?? m.programDuration);
      m.signupAcademicStart = academicStart();
      if (Number(m.programDuration) > 0) m.graduationYear = graduationYearFor(m);
    }
    autoAssign(state, m); // once the profile is filled in, a student joins a family
    return withDetails(state, m);
  }),

  listMembers: () => store.transact((state) => { graduate(state); return state.members.map((m) => ({ ...strip(m), ...leaderInfo(state, m.email) })); }),
  listFamilies: () => store.transact((state) => { graduate(state); return [...state.families]; }),

  updateMember: (id, patch) => store.transact((state) => {
    const m = state.members.find((x) => String(x.id) === String(id));
    if (!m) throw new Error('Member not found');
    const { passwordHash, id: _ignore, ...safe } = patch;
    Object.assign(m, safe);
    if (m.category === 'alumni' || m.category === 'associate') m.familyId = null;
    autoAssign(state, m);
    return strip(m);
  }),
  removeMember: (id) => store.transact((state) => { state.members = state.members.filter((x) => String(x.id) !== String(id)); return { ok: true }; }),

  previewFamilies: async ({ size }) => generateFamilies(await local.listMembers(), { size }),
  applyFamilies: (defs) => store.transact((state) => {
    state.families = defs.map((d, i) => ({ id: i + 1, name: d.name || familyName(i), createdAt: new Date().toISOString().slice(0, 10) }));
    state.members.forEach((m) => { m.familyId = null; });
    defs.forEach((d, i) => d.memberIds.forEach((mid) => { const m = state.members.find((x) => x.id === mid); if (m) m.familyId = i + 1; }));
    return { families: state.families.length };
  }),
  renameFamily: (id, name) => store.update('families', id, { name }),
  assignUnassigned: () => store.transact((state) => {
    let n = 0;
    state.members.forEach((m) => { if (isStudent(m) && m.approved !== false && !m.familyId && !hasFinished(m)) { autoAssign(state, m); if (m.familyId) n += 1; } });
    return { assigned: n };
  }),
  syncGraduations: () => store.transact((state) => ({ moved: graduate(state) })),

  addSamples: (n = 24) => store.transact((state) => {
    const first = ['Neema', 'Baraka', 'Grace', 'Joseph', 'Esther', 'Daniel', 'Upendo', 'Emmanuel', 'Faith', 'Samuel', 'Mercy', 'Isaac', 'Joy', 'Peter', 'Rehema', 'John', 'Anna', 'Paul', 'Zawadi', 'Michael'];
    const last = ['Mushi', 'Kimaro', 'Massawe', 'Mwakyusa', 'Lyimo', 'Mrema', 'Msuya', 'Kileo', 'Temba', 'Mlay'];
    const programs = ['Computer Science', 'Law', 'Engineering', 'Education', 'Economics', 'Medicine', 'Journalism'];
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const now = new Date();
    for (let i = 0; i < n; i++) {
      const duration = pick([3, 3, 4, 4, 5]);
      const year = 1 + Math.floor(Math.random() * duration);
      const baptized = Math.random() > 0.3;
      const rec = {
        id: nextId(state.members), category: 'member', fullName: `${pick(first)} ${pick(last)}`, gender: Math.random() > 0.5 ? 'Female' : 'Male',
        address: 'UDSM Hostels', baptized, baptizedChurch: baptized ? pick(['Chuo Kikuu SDA', 'Mwenge SDA', 'Kinondoni SDA']) : '', phone: '', email: `sample${Date.now()}${i}@example.com`,
        photo: null, passwordHash: 'sample', approved: true, familyId: null, sample: true, createdAt: now.toISOString().slice(0, 10),
        institution: 'University of Dar es Salaam', program: pick(programs), programDuration: duration, yearOfStudy: year, signupAcademicStart: academicStart(now),
      };
      rec.graduationYear = graduationYearFor(rec, now);
      state.members.push(rec);
    }
    return { added: n };
  }),
};
