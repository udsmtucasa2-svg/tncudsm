// Member rules shared by the whole frontend. The backend must implement the same rules
// (see backend-reference/ADMIN_API.md): the academic year starts in September, and a student
// finishes on 1 July of their graduation year.

export const CATEGORIES = [
  { key: 'member', label: 'Member', note: 'A student member of the fellowship' },
  { key: 'associate', label: 'Associate', note: 'Staff, friend or neighbour who worships with us' },
  { key: 'alumni', label: 'Alumni', note: 'A former student who has completed studies' },
];
// Leaders do not register as leaders. They are recognised when their email matches a leader added by the admin.
// 'leader' stays in this list only so older saved records keep working.
export const STUDENT_CATEGORIES = ['member', 'leader'];
export const isStudent = (m) => STUDENT_CATEGORIES.includes(m.category);
export const catLabel = (key) => (key === 'leader' ? 'Member' : CATEGORIES.find((c) => c.key === key)?.label || key);
export const normEmail = (e) => String(e || '').trim().toLowerCase();

// Sign-in roles shown on the Login and Register pages (a leader signs in as a Member).
export const ROLES = [
  { key: 'member', label: 'Member' },
  { key: 'alumni', label: 'Alumni' },
  { key: 'associate', label: 'Associate' },
];

// Phones are compared by their last 9 digits, so 0712 345 678, +255712345678 and 255712345678 are the same number.
export const normPhone = (p) => String(p || '').replace(/\D/g, '').slice(-9);

// The sign-in identifier is either an email or a phone number.
export function parseIdentifier(raw) {
  const v = String(raw || '').trim();
  if (/^\S+@\S+\.\S+$/.test(v)) return { type: 'email', value: normEmail(v) };
  if (/^\+?[\d\s-]{9,15}$/.test(v) && normPhone(v).length === 9) return { type: 'phone', value: v.replace(/[\s-]/g, '') };
  return null;
}

export const academicStart = (d = new Date()) => (d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1);

// Year of study advances by itself every September, capped at the programme length.
export function currentYearOfStudy(m, d = new Date()) {
  if (!isStudent(m) || !m.yearOfStudy) return null;
  const advanced = Number(m.yearOfStudy) + (academicStart(d) - (m.signupAcademicStart ?? academicStart(d)));
  return Math.min(Math.max(advanced, 1), Number(m.programDuration) || advanced);
}

// Calendar year in which the student finishes (end of their last academic year).
export const graduationYearFor = ({ yearOfStudy, programDuration }, d = new Date()) =>
  academicStart(d) + (Number(programDuration) - Number(yearOfStudy)) + 1;

export const hasFinished = (m, d = new Date()) => isStudent(m) && !!m.graduationYear && d >= new Date(Number(m.graduationYear), 6, 1);

export const ordinal = (n) => (n ? `Year ${n}` : '-');

// How complete a member's profile is (drives the dashboard progress bar).
export function completeness(m) {
  const base = ['fullName', 'gender', 'address', 'phone', 'photo'];
  const student = isStudent(m) ? ['program', 'yearOfStudy', 'programDuration'] : [];
  const church = m.baptized ? ['baptizedChurch'] : [];
  const keys = [...base, ...student, ...church];
  const done = keys.filter((k) => m[k] !== undefined && m[k] !== null && String(m[k]).trim() !== '').length;
  return { percent: Math.round((done / keys.length) * 100), missing: keys.filter((k) => !m[k]) };
}

export const initials = (name = '') => name.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?';
