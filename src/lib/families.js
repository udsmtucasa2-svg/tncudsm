// Family formation. Students (Member and Leader categories, approved, not yet graduated) are
// dealt into families like cards: sorted by year of study then gender, shuffled inside each
// group, then handed out round-robin. Every family ends up with a similar mix of years and
// genders, and the result is different every time it is generated.
import { isStudent, currentYearOfStudy, hasFinished } from './members.js';

export const FAMILY_NAMES = ['Judah', 'Levi', 'Benjamin', 'Joseph', 'Ephraim', 'Reuben', 'Simeon', 'Naphtali', 'Asher', 'Gad', 'Issachar', 'Zebulun', 'Caleb', 'Joshua', 'Samuel', 'Gideon', 'Esther', 'Ruth', 'Deborah', 'Hannah'];
export const familyName = (i) => FAMILY_NAMES[i] || `Family ${i + 1}`;

const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

export const eligibleMembers = (members, now = new Date()) =>
  members.filter((m) => isStudent(m) && m.approved !== false && !hasFinished(m, now));

// Returns [{ name, memberIds }]
export function generateFamilies(members, { size = 8 } = {}, now = new Date()) {
  const pool = eligibleMembers(members, now);
  if (pool.length === 0) return [];
  const count = Math.max(1, Math.round(pool.length / Math.max(2, size)));

  const buckets = new Map();
  pool.forEach((m) => {
    const key = `${currentYearOfStudy(m, now)}|${m.gender}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(m);
  });
  const ordered = [...buckets.keys()].sort().flatMap((k) => shuffle(buckets.get(k)));

  const names = shuffle(FAMILY_NAMES).slice(0, count);
  const families = Array.from({ length: count }, (_, i) => ({ name: names[i] || familyName(i), memberIds: [] }));
  ordered.forEach((m, i) => families[i % count].memberIds.push(m.id));
  evenOutGender(families, pool, now);
  return families;
}

// Dealing keeps sizes and years even; this pass then swaps a woman and a man of the SAME year
// between the family with the most women and the one with the fewest, until the split is
// within one person. Year and size balance are untouched by a same-year swap.
function evenOutGender(families, pool, now) {
  if (families.length < 2) return;
  const byId = new Map(pool.map((m) => [m.id, m]));
  const females = (f) => f.memberIds.filter((id) => byId.get(id).gender === 'Female').length;
  for (let round = 0; round < 500; round++) {
    const ranked = [...families].sort((a, b) => females(b) - females(a));
    let swapped = false;
    for (const hi of ranked) {
      for (const lo of [...ranked].reverse()) {
        if (females(hi) - females(lo) <= 1) continue;
        const give = hi.memberIds.find((id) => byId.get(id).gender === 'Female' && lo.memberIds.some((o) => byId.get(o).gender === 'Male' && currentYearOfStudy(byId.get(o), now) === currentYearOfStudy(byId.get(id), now)));
        if (!give) continue;
        const take = lo.memberIds.find((o) => byId.get(o).gender === 'Male' && currentYearOfStudy(byId.get(o), now) === currentYearOfStudy(byId.get(give), now));
        hi.memberIds[hi.memberIds.indexOf(give)] = take;
        lo.memberIds[lo.memberIds.indexOf(take)] = give;
        swapped = true;
        break;
      }
      if (swapped) break;
    }
    if (!swapped) return;
  }
}

// Summary used by the admin cards: totals, gender split and year split.
export function familyStats(people, now = new Date()) {
  const byYear = {};
  let male = 0; let female = 0;
  people.forEach((m) => {
    if (m.gender === 'Male') male += 1; else if (m.gender === 'Female') female += 1;
    const y = currentYearOfStudy(m, now);
    if (y) byYear[y] = (byYear[y] || 0) + 1;
  });
  return { total: people.length, male, female, byYear };
}

// Best family for a newcomer: smallest first, then the one with the fewest people of the same
// gender, then the fewest in the same year. Ties are broken randomly.
export function pickFamilyFor(member, families, members, now = new Date()) {
  if (!families.length) return null;
  const year = currentYearOfStudy(member, now);
  const scored = families.map((f) => {
    const people = members.filter((m) => m.familyId === f.id && m.id !== member.id);
    const sameGender = people.filter((m) => m.gender === member.gender).length;
    const sameYear = people.filter((m) => currentYearOfStudy(m, now) === year).length;
    return { f, score: people.length * 1000 + sameGender * 10 + sameYear + Math.random() * 0.5 };
  });
  return scored.sort((a, b) => a.score - b.score)[0].f;
}
