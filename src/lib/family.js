// Academic-year, graduation and family helpers shared by the public site, the member dashboard
// and the admin panel. Everything here is plain functions, so the same rules apply everywhere.

// The academic year starts in this month (0 = January, 8 = September). Change it in one place if needed.
export const ACADEMIC_YEAR_STARTS_IN_MONTH = 8;
export const academicStart = (now = new Date()) =>
  (now.getMonth() >= ACADEMIC_YEAR_STARTS_IN_MONTH ? now.getFullYear() : now.getFullYear() - 1);

export const CATEGORIES = [
  { key: 'member', label: 'Member' },
  { key: 'leader', label: 'Leader' },
  { key: 'associate', label: 'Associate | Alumni' },
];
export const categoryLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label || key;

// Members and leaders are students. Associates and alumni are not placed in families.
export const isStudent = (m) => m.category !== 'associate';

// The year of study moves up by itself every academic year.
export const studyYearNow = (m) => {
  if (!isStudent(m) || !m.yearOfStudy) return null;
  const base = Number(m.regAcademicStart ?? academicStart());
  return Number(m.yearOfStudy) + (academicStart() - base);
};

export const hasGraduated = (m) => isStudent(m) && Boolean(m.duration) && studyYearNow(m) > Number(m.duration);

export const graduationYear = (m) => {
  if (!isStudent(m)) return m.graduationYear ? Number(m.graduationYear) : null;
  if (!m.duration || !m.yearOfStudy) return null;
  return Number(m.regAcademicStart ?? academicStart()) + Number(m.duration) - Number(m.yearOfStudy) + 1;
};

// Only current students belong to a family. Graduates and associates are removed from families.
export const inFamilyPool = (m) => isStudent(m) && !hasGraduated(m);

const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Random but balanced: members are shuffled, grouped by (year of study, gender) and then dealt
// to the families one by one, like cards. Every family ends up with a similar mix of years and
// genders, and family sizes differ by at most one. Returns { memberId: familyIndex (0-based) }.
export function dealFamilies(pool, count) {
  const groups = new Map();
  shuffle(pool).forEach((m) => {
    const k = `${studyYearNow(m)}|${m.gender}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(m);
  });
  const ordered = [...groups.keys()].sort().flatMap((k) => groups.get(k));
  const start = Math.floor(Math.random() * count);
  const plan = {};
  ordered.forEach((m, i) => { plan[m.id] = (start + i) % count; });
  return plan;
}

// Best family for one new member: smallest family first, then the one with the fewest people of the
// same gender, then the fewest in the same year of study, then random.
export function pickFamily(member, families, members) {
  if (!families.length) return null;
  const pool = members.filter((m) => inFamilyPool(m) && m.id !== member.id);
  const year = studyYearNow(member);
  const scored = families.map((f) => {
    const mine = pool.filter((m) => String(m.familyId) === String(f.id));
    return { id: f.id, s: [mine.length, mine.filter((m) => m.gender === member.gender).length, mine.filter((m) => studyYearNow(m) === year).length, Math.random()] };
  });
  scored.sort((a, b) => { for (let i = 0; i < 4; i += 1) { if (a.s[i] !== b.s[i]) return a.s[i] - b.s[i]; } return 0; });
  return scored[0].id;
}
