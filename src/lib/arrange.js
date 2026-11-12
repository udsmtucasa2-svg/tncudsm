// Display ordering helpers. The backend should already return sorted data; these keep the
// page correct even if it does not.
const key = (d) => String(d ?? '');
export const todayISO = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
};
export const byOrder = (a, b) => (a.order ?? 1e9) - (b.order ?? 1e9);
export const newestFirst = (list = []) => [...list].sort((a, b) => key(b.date).localeCompare(key(a.date)));
export const upcomingEvents = (list = []) => list.filter((e) => key(e.date) >= todayISO()).sort((a, b) => key(a.date).localeCompare(key(b.date)));
export const pastEvents = (list = []) => newestFirst(list.filter((e) => key(e.date) < todayISO()));
export const fmtDate = (d, o = { day: 'numeric', month: 'short', year: 'numeric' }) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', o) : '');
