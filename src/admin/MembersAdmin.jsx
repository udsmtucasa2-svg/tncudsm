import { useMemo, useState } from 'react';
import { LuSearch, LuX, LuDownload, LuCheck, LuTrash2, LuUsers, LuChevronDown } from 'react-icons/lu';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import { Avatar } from '../components/FormFields.jsx';
import { CATEGORIES, catLabel, currentYearOfStudy, isStudent, ordinal } from '../lib/members.js';

const GROUPINGS = [['category', 'Category'], ['role', 'Leaders and members'], ['family', 'Family'], ['year', 'Year of study'], ['gender', 'Gender'], ['baptism', 'Baptism']];
const catOrder = CATEGORIES.map((c) => c.key);

async function loadAll() {
  const [members, families] = await Promise.all([api.admin.list('members'), api.admin.list('families')]);
  return { members, families };
}

const statusOf = (m) => (m.isLeader ? 'Leader' : 'Active');

function groupMembers(list, by, famName) {
  const groups = new Map();
  const add = (key, label, order, m) => { if (!groups.has(key)) groups.set(key, { key, label, order, items: [] }); groups.get(key).items.push(m); };
  list.forEach((m) => {
    const y = currentYearOfStudy(m);
    if (by === 'role') add(m.isLeader ? 'lead' : 'mem', m.isLeader ? 'Leaders' : 'Members and others', m.isLeader ? 0 : 1, m);
    if (by === 'category') add(m.category, catLabel(m.category), catOrder.indexOf(m.category), m);
    if (by === 'family') (m.familyId ? add(`f${m.familyId}`, `Family ${famName(m.familyId)}`, 0, m) : add('none', isStudent(m) ? 'Not in a family yet' : 'Not in a family (not a current student)', 99, m));
    if (by === 'year') (y ? add(`y${y}`, ordinal(y), y, m) : add('na', 'Not a current student', 99, m));
    if (by === 'gender') add(m.gender || '-', m.gender || 'Not stated', m.gender === 'Male' ? 0 : 1, m);
    if (by === 'baptism') add(m.baptized ? 'yes' : 'no', m.baptized ? 'Baptized' : 'Not baptized', m.baptized ? 0 : 1, m);
  });
  return [...groups.values()].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}

function downloadCsv(rows, famName) {
  const head = ['Name', 'Category', 'Gender', 'Email', 'Phone', 'Address', 'Baptized', 'Baptized at', 'Institution', 'Programme', 'Year of study', 'Duration (years)', 'Completion year', 'Family', 'Status', 'Registered'];
  const body = rows.map((m) => [m.fullName, catLabel(m.category), m.gender, m.email, m.phone, m.address, m.baptized ? 'Yes' : 'No', m.baptizedChurch, m.institution, m.program, currentYearOfStudy(m) || '', m.programDuration || '', m.graduationYear || '', m.familyId ? famName(m.familyId) : '', statusOf(m), m.createdAt]);
  const csv = [head, ...body].map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
  a.download = `tnc-members-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Drawer({ m, families, famName, onClose, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const year = currentYearOfStudy(m);

  const patch = async (p) => {
    setBusy(true); setError('');
    try { await api.admin.update('members', m.id, p); await onChanged(); } catch (err) { setError(err.message); }
    setBusy(false);
  };
  const remove = async () => {
    setBusy(true);
    try { await api.admin.remove('members', m.id); await onChanged(true); } catch (err) { setError(err.message); setBusy(false); }
  };
  const Item = ({ k, children }) => <div><dt>{k}</dt><dd>{children || <span className="adm-dim">Not given</span>}</dd></div>;

  return (
    <div className="adm-drawer" role="dialog" aria-modal="true" aria-label={`Member ${m.fullName}`}>
      <button className="adm-modal__scrim" aria-label="Close" onClick={onClose} tabIndex={-1} />
      <aside className="adm-drawer__panel">
        <header><h2>Member details</h2><button onClick={onClose} aria-label="Close"><LuX aria-hidden="true" /></button></header>
        <div className="adm-drawer__body">
          <div className="adm-drawer__id">
            <Avatar name={m.fullName} photo={m.photo} size="xl" />
            <div>
              <h3>{m.fullName}</h3>
              <p><span className="adm-pill adm-pill--ok">{statusOf(m)}</span> <span className="adm-pill adm-pill--muted">{catLabel(m.category)}</span></p>
              <small>Registered {m.createdAt}</small>
            </div>
          </div>

          <dl className="adm-kv">
            <Item k="Gender">{m.gender}</Item>
            <Item k="Email">{m.email}</Item>
            <Item k="Phone">{m.phone}</Item>
            <Item k="Address">{m.address}</Item>
            <Item k="Baptized">{m.baptized ? `Yes${m.baptizedChurch ? `, at ${m.baptizedChurch}` : ''}` : 'No'}</Item>
            {m.isLeader && <Item k="Leadership">{m.leaderPosition || 'Leader'}</Item>}
            {m.organisation && <Item k="Organisation">{m.organisation}</Item>}
            {(isStudent(m) || m.category === 'alumni') && <Item k="Institution">{m.institution}</Item>}
            {(isStudent(m) || m.category === 'alumni') && <Item k="Programme">{m.program}</Item>}
            {isStudent(m) && <Item k="Year of study">{`${ordinal(year)} of ${m.programDuration} years`}</Item>}
            {m.graduationYear && <Item k={m.category === 'alumni' ? 'Completed' : 'Finishes'}>{m.category === 'alumni' ? m.graduationYear : `July ${m.graduationYear}`}</Item>}
          </dl>

          <div className="adm-field"><label htmlFor="d-cat">Category</label>
            <select id="d-cat" value={m.category} disabled={busy} onChange={(e) => patch({ category: e.target.value })}>{CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}</select>
          </div>
          {isStudent(m) && (
            <div className="adm-field"><label htmlFor="d-fam">Family</label>
              <select id="d-fam" value={m.familyId || ''} disabled={busy} onChange={(e) => patch({ familyId: e.target.value ? Number(e.target.value) : null })}>
                <option value="">No family</option>
                {families.map((f) => <option key={f.id} value={f.id}>Family {f.name}</option>)}
              </select>
              {m.familyId && <small>Currently in Family {famName(m.familyId)}</small>}
            </div>
          )}
          {error && <p className="adm-error" role="alert">{error}</p>}
        </div>
        <footer>
          {confirmDelete ? (
            <>
              <span className="adm-error">Delete this member permanently?</span>
              <button className="adm-btn adm-btn--ghost" onClick={() => setConfirmDelete(false)}>No</button>
              <button className="adm-btn adm-btn--danger" onClick={remove} disabled={busy}>Yes, delete</button>
            </>
          ) : <button className="adm-btn adm-btn--ghost" onClick={() => setConfirmDelete(true)}><LuTrash2 aria-hidden="true" />Delete member</button>}
        </footer>
      </aside>
    </div>
  );
}

export default function MembersAdmin() {
  const { data, loading, error, reload } = useFetch(loadAll, null);
  const [q, setQ] = useState('');
  const [by, setBy] = useState('category');
  const [cat, setCat] = useState('');
  const [selected, setSelected] = useState(null);
  const [closed, setClosed] = useState({});

  const members = data?.members ?? [];
  const families = data?.families ?? [];
  const famName = (id) => families.find((f) => f.id === id)?.name || '-';

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return members.filter((m) => (!cat || (cat === '__leader' ? m.isLeader : m.category === cat)) && (!needle || [m.fullName, m.email, m.phone, m.program, m.address].some((v) => String(v || '').toLowerCase().includes(needle))));
  }, [members, q, cat]);
  const groups = useMemo(() => groupMembers(rows, by, famName), [rows, by, families]); // eslint-disable-line react-hooks/exhaustive-deps
  const picked = selected && members.find((m) => m.id === selected);

  if (loading && !data) return <Loader />;
  if (error || !data) return <ErrorNotice onRetry={reload}>We could not load the members.</ErrorNotice>;

  const stats = [
    ['Registered', members.length],
    ['Students in families', members.filter((m) => m.familyId).length],
    ['Baptized', members.filter((m) => m.baptized).length],
    ['Not yet baptized', members.filter((m) => !m.baptized).length],
    ['Leaders', members.filter((m) => m.isLeader).length],
    ['Alumni', members.filter((m) => m.category === 'alumni').length],
  ];

  return (
    <>
      <div className="adm-head">
        <div><h1>Members</h1><p>Everyone who registered, grouped the way you need. Click a member to see all their details.</p></div>
        <button className="adm-btn adm-btn--ghost" onClick={() => downloadCsv(rows, famName)} disabled={!rows.length}><LuDownload aria-hidden="true" />Export {rows.length} to CSV</button>
      </div>

      <div className="adm-mini-stats">{stats.map(([k, v]) => <div key={k}><b>{v}</b><span>{k}</span></div>)}</div>

      <div className="adm-card adm-card--flush">
        <div className="adm-toolbar">
          <label className="adm-search"><LuSearch aria-hidden="true" /><input type="search" placeholder="Search name, email, phone or programme" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search members" /></label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category"><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}<option value="__leader">Leaders</option></select>
          <label className="adm-groupby">Group by
            <select value={by} onChange={(e) => setBy(e.target.value)} aria-label="Group by">{GROUPINGS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          </label>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="adm-card"><div className="adm-empty"><LuUsers aria-hidden="true" /><p>No one has registered yet. Members appear here as soon as they sign up.</p></div></div>
      ) : groups.length === 0 ? (
        <div className="adm-card"><div className="adm-empty"><p>Nothing matches your search.</p></div></div>
      ) : groups.map((g) => (
        <section key={g.key} className="adm-card adm-card--flush adm-group">
          <button className="adm-group__head" onClick={() => setClosed((c) => ({ ...c, [g.key]: !c[g.key] }))} aria-expanded={!closed[g.key]}>
            <h2>{g.label}</h2><span className="adm-pill adm-pill--muted">{g.items.length}</span><LuChevronDown className={closed[g.key] ? 'is-shut' : ''} aria-hidden="true" />
          </button>
          {!closed[g.key] && (
            <div className="adm-table-wrap">
              <table className="adm-table adm-table--click">
                <thead><tr><th>Member</th><th>Category</th><th>Year</th><th>Programme</th><th>Family</th><th>Baptized</th><th>Status</th></tr></thead>
                <tbody>
                  {g.items.map((m) => (
                    <tr key={m.id} onClick={() => setSelected(m.id)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSelected(m.id)}>
                      <td><div className="adm-cell"><Avatar name={m.fullName} photo={m.photo} /><div><b>{m.fullName || "Profile not completed"}</b><small>{m.email || m.phone}</small></div></div></td>
                      <td>{catLabel(m.category)}{m.isLeader && m.leaderPosition ? <small>{m.leaderPosition}</small> : null}</td>
                      <td>{ordinal(currentYearOfStudy(m))}</td>
                      <td>{m.program || '-'}</td>
                      <td>{m.familyId ? famName(m.familyId) : '-'}</td>
                      <td>{m.baptized ? 'Yes' : 'No'}</td>
                      <td><span className={`adm-pill adm-pill--${m.isLeader ? 'ok' : 'muted'}`}>{statusOf(m)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}

      {picked && <Drawer m={picked} families={families} famName={famName} onClose={() => setSelected(null)} onChanged={async (closeAfter) => { await reload(); if (closeAfter) setSelected(null); }} />}
    </>
  );
}
