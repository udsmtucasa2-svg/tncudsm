import { useMemo, useState } from 'react';
import { LuSearch, LuDownload, LuShuffle, LuX, LuTrash2, LuPencil, LuTriangleAlert, LuCheck, LuChevronDown, LuUsers } from 'react-icons/lu';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import { Avatar } from '../pages/MemberDashboard.jsx';
import { sections } from '../data/leadershipStructure.js';
import { categoryLabel, isStudent, studyYearNow, hasGraduated, graduationYear, inFamilyPool } from '../lib/family.js';
import '../styles/members.css';

const GROUPS = [
  ['family', 'Family'], ['year', 'Year of study'], ['category', 'Registered as'],
  ['gender', 'Gender'], ['baptism', 'Baptism'], ['programme', 'Programme'],
];
const LAST = new Set(['Graduated', 'Alumni and associates', 'Not yet in a family', 'Not set']);
const sectionName = (key) => sections.find((s) => s.key === key)?.label || '';

// One flat, display-ready record per member.
function view(m, familyById) {
  const year = studyYearNow(m);
  const graduated = hasGraduated(m);
  return {
    ...m, year, graduated, pool: inFamilyPool(m), gradYear: graduationYear(m),
    familyName: m.familyId != null ? familyById.get(String(m.familyId))?.name || '' : '',
  };
}

function groupLabel(v, by) {
  if (by === 'family') {
    if (!isStudent(v)) return 'Alumni and associates';
    if (v.graduated) return 'Graduated';
    return v.familyName || 'Not yet in a family';
  }
  if (by === 'year') return !isStudent(v) ? 'Alumni and associates' : v.graduated ? 'Graduated' : `Year ${v.year}`;
  if (by === 'category') return categoryLabel(v.category);
  if (by === 'gender') return v.gender || 'Not set';
  if (by === 'baptism') return v.baptised === 'Yes' ? 'Baptised' : 'Not baptised';
  return v.programme?.trim() || (isStudent(v) ? 'Not set' : 'Alumni and associates');
}

const yearText = (v) => (!isStudent(v) ? v.affiliation || 'Associate' : v.graduated ? 'Graduated' : `Year ${v.year} of ${v.duration}`);

function exportCsv(rows) {
  const head = ['Name', 'Email', 'Phone', 'Registered as', 'Gender', 'Address', 'Baptised', 'Baptised at', 'Programme', 'Duration (years)', 'Year of study now', 'Graduation year', 'Family', 'Status', 'Registered on'];
  const esc = (x) => `"${String(x ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((v) => [
    v.fullName, v.email, v.phone, categoryLabel(v.category), v.gender, v.address, v.baptised, v.baptismChurch, v.programme,
    v.duration, v.graduated || !isStudent(v) ? '' : v.year, v.gradYear, v.familyName, v.graduated ? 'Graduated' : isStudent(v) ? 'Active student' : v.affiliation, (v.createdAt || '').slice(0, 10),
  ].map(esc).join(','));
  const blob = new Blob([`\uFEFF${[head.map(esc).join(','), ...lines].join('\n')}`], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `tnc-members-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Modal({ title, onClose, small, children, footer }) {
  return (
    <div className="adm-modal" role="dialog" aria-modal="true" aria-label={title}>
      <button className="adm-modal__scrim" aria-label="Close" onClick={onClose} tabIndex={-1} />
      <div className={`adm-modal__box ${small ? 'adm-modal__box--sm' : ''}`}>
        <header><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Close"><LuX aria-hidden="true" /></button></header>
        {children}
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return <div className="mgr-detail"><dt>{label}</dt><dd>{value}</dd></div>;
}

export default function Members() {
  const { data, loading, error, reload } = useFetch(async () => {
    const [members, families] = await Promise.all([api.admin.list('members'), api.admin.list('families')]);
    return { members, families };
  }, { members: [], families: [] });

  const [q, setQ] = useState('');
  const [by, setBy] = useState('family');
  const [open, setOpen] = useState(null);       // member being viewed
  const [forming, setForming] = useState(false);
  const [count, setCount] = useState(1);
  const [renaming, setRenaming] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [moveTo, setMoveTo] = useState('');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');

  const familyById = useMemo(() => new Map(data.families.map((f) => [String(f.id), f])), [data.families]);
  const all = useMemo(() => data.members.map((m) => view(m, familyById)), [data.members, familyById]);
  const eligible = all.filter((v) => v.pool).length;
  const suggested = Math.max(1, Math.ceil(eligible / 12));

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter((v) => [v.fullName, v.email, v.phone, v.address, v.programme, v.baptismChurch, v.familyName].some((x) => String(x || '').toLowerCase().includes(needle)));
  }, [all, q]);

  const groups = useMemo(() => {
    const map = new Map();
    rows.forEach((v) => {
      const label = groupLabel(v, by);
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(v);
    });
    // Families that exist but have nobody yet still show, so the admin sees the whole structure.
    if (by === 'family' && !q.trim()) data.families.forEach((f) => { if (!map.has(f.name)) map.set(f.name, []); });
    return [...map.entries()]
      .sort(([a], [b]) => (LAST.has(a) - LAST.has(b)) || a.localeCompare(b, undefined, { numeric: true }))
      .map(([label, list]) => ({
        label,
        family: by === 'family' ? data.families.find((f) => f.name === label) : null,
        list: list.sort((a, b) => ((a.year || 99) - (b.year || 99)) || a.fullName.localeCompare(b.fullName)),
      }));
  }, [rows, by, q, data.families]);

  const stat = {
    total: all.length,
    students: all.filter((v) => v.pool).length,
    inFamily: all.filter((v) => v.pool && v.familyName).length,
    leaders: all.filter((v) => v.category === 'leader').length,
    alumni: all.filter((v) => !isStudent(v) || v.graduated).length,
    baptised: all.filter((v) => v.baptised === 'Yes').length,
  };

  const flash = (t) => { setToast(t); setTimeout(() => setToast(''), 2600); };

  const form = async () => {
    setBusy(true); setFailure('');
    try {
      const r = await api.admin.formFamilies(count);
      setForming(false); flash(`${r.families} families formed with ${r.assigned} members`); reload();
    } catch (err) { setFailure(err.message || 'Could not form families.'); }
    setBusy(false);
  };

  const saveRename = async () => {
    if (!renaming.name.trim()) return;
    setBusy(true);
    try { await api.admin.update('families', renaming.id, { name: renaming.name.trim() }); setRenaming(null); flash('Family renamed'); reload(); }
    catch (err) { setFailure(err.message || 'Could not rename.'); }
    setBusy(false);
  };

  const saveMove = async () => {
    setBusy(true); setFailure('');
    try {
      await api.admin.update('members', open.id, { familyId: moveTo === '' ? null : Number(moveTo) });
      setOpen(null); flash('Member updated'); reload();
    } catch (err) { setFailure(err.message || 'Could not save.'); }
    setBusy(false);
  };

  const remove = async () => {
    setBusy(true); setFailure('');
    try { await api.admin.remove('members', removing.id); setRemoving(null); setOpen(null); flash('Member removed'); reload(); }
    catch (err) { setFailure(err.message || 'Could not remove.'); }
    setBusy(false);
  };

  const openMember = (v) => { setFailure(''); setMoveTo(v.familyId != null ? String(v.familyId) : ''); setOpen(v); };

  return (
    <>
      <div className="adm-head">
        <div><h1>Members</h1><p>Everyone who registered on the website. Group them, open a profile, and form families from year of study and gender.</p></div>
        <div className="adm-actions">
          <button className="adm-btn adm-btn--ghost" onClick={() => exportCsv(rows)} disabled={!rows.length}><LuDownload aria-hidden="true" />Export CSV</button>
          <button className="adm-btn adm-btn--primary" onClick={() => { setCount(data.families.length || suggested); setFailure(''); setForming(true); }}><LuShuffle aria-hidden="true" />Form families</button>
        </div>
      </div>

      <div className="mgr-stats">
        {[['Total', stat.total], ['Active students', stat.students], ['In a family', stat.inFamily], ['Leaders', stat.leaders], ['Alumni and associates', stat.alumni], ['Baptised', stat.baptised]].map(([l, n]) => (
          <div key={l} className="mgr-stat"><b>{n}</b><span>{l}</span></div>
        ))}
      </div>

      <div className="adm-card adm-card--flush">
        <div className="adm-toolbar">
          <label className="adm-search"><LuSearch aria-hidden="true" /><input type="search" placeholder="Search name, email, programme, church" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search members" /></label>
          <label className="mgr-by"><span>Group by</span>
            <select value={by} onChange={(e) => setBy(e.target.value)} aria-label="Group members by">{GROUPS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          </label>
          <span className="adm-count">{rows.length} {rows.length === 1 ? 'member' : 'members'}</span>
        </div>

        {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload}>{error.message}</ErrorNotice> : groups.length === 0 ? (
          <div className="adm-empty"><LuUsers aria-hidden="true" /><p>{all.length === 0 ? 'No one has registered yet. Members appear here as soon as they create an account.' : 'Nothing matches your search.'}</p></div>
        ) : groups.map((g) => (
          <details key={g.label} className="mgr-group" open>
            <summary>
              <LuChevronDown className="mgr-group__chev" aria-hidden="true" />
              <span className="mgr-group__name">{g.label}</span>
              <span className="mgr-group__count">{g.list.length}</span>
              <span className="mgr-group__split">{g.list.filter((v) => v.gender === 'Male').length} male, {g.list.filter((v) => v.gender === 'Female').length} female</span>
              {g.family && <button type="button" className="adm-icon" title="Rename family" aria-label={`Rename ${g.label}`} onClick={(e) => { e.preventDefault(); setFailure(''); setRenaming({ id: g.family.id, name: g.family.name }); }}><LuPencil aria-hidden="true" /></button>}
            </summary>
            {g.list.length === 0 ? <p className="mgr-empty">No members in this family yet.</p> : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Member</th><th>Registered as</th><th>Gender</th><th>Study</th><th>Programme</th><th>Baptised</th><th>Family</th></tr></thead>
                  <tbody>
                    {g.list.map((v) => (
                      <tr key={v.id} className="mgr-row" onClick={() => openMember(v)} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') openMember(v); }}>
                        <td><div className="adm-cell"><Avatar photo={v.photo} name={v.fullName} size={38} /><div><b>{v.fullName || "Profile not completed"}</b><small>{v.email || v.phone}</small></div></div></td>
                        <td>{categoryLabel(v.category)}</td>
                        <td>{v.gender}</td>
                        <td>{yearText(v)}</td>
                        <td>{v.programme || '-'}</td>
                        <td>{v.baptised === 'Yes' ? <span className="adm-pill adm-pill--ok">Yes</span> : <span className="adm-pill adm-pill--muted">No</span>}</td>
                        <td>{v.familyName || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </details>
        ))}
      </div>

      {open && (
        <Modal title="Member profile" onClose={() => setOpen(null)}
          footer={<>
            {failure && <p className="adm-error" role="alert">{failure}</p>}
            <button className="adm-btn adm-btn--danger" onClick={() => { setFailure(''); setRemoving(open); }}><LuTrash2 aria-hidden="true" />Remove</button>
            <button className="adm-btn adm-btn--ghost" onClick={() => setOpen(null)}>Close</button>
            {open.pool && <button className="adm-btn adm-btn--primary" onClick={saveMove} disabled={busy}><LuCheck aria-hidden="true" />Save family</button>}
          </>}>
          <div className="mgr-profile">
            <Avatar photo={open.photo} name={open.fullName} size={88} />
            <div><h3>{open.fullName}</h3><p>{categoryLabel(open.category)}{open.graduated ? ' (graduated)' : ''}</p></div>
          </div>
          <dl className="mgr-details">
            <Detail label="Email" value={open.email} />
            <Detail label="Phone" value={open.phone} />
            <Detail label="Gender" value={open.gender} />
            <Detail label="Address" value={open.address} />
            <Detail label="Baptised" value={open.baptised} />
            <Detail label="Baptised at" value={open.baptismChurch} />
            <Detail label="Programme" value={open.programme} />
            <Detail label="Year of study" value={isStudent(open) ? yearText(open) : open.affiliation} />
            <Detail label="Graduation year" value={open.gradYear} />
            <Detail label="Ministry" value={sectionName(open.ministry)} />
            <Detail label="Registered on" value={(open.createdAt || '').slice(0, 10)} />
          </dl>
          {open.pool ? (
            <div className="adm-field mgr-move"><label htmlFor="mgr-family">Family</label>
              <select id="mgr-family" value={moveTo} onChange={(e) => setMoveTo(e.target.value)}>
                <option value="">Not in a family</option>
                {data.families.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              {data.families.length === 0 && <small>No families exist yet. Use Form families first.</small>}
            </div>
          ) : <p className="mgr-note">{isStudent(open) ? 'This member has graduated, so they were removed from their family automatically.' : 'Alumni and associates are not placed in families.'}</p>}
        </Modal>
      )}

      {forming && (
        <Modal title="Form families" small onClose={() => setForming(false)}
          footer={<>
            {failure && <p className="adm-error" role="alert">{failure}</p>}
            <button className="adm-btn adm-btn--ghost" onClick={() => setForming(false)}>Cancel</button>
            <button className="adm-btn adm-btn--primary" onClick={form} disabled={busy || eligible === 0}><LuShuffle aria-hidden="true" />{busy ? 'Forming...' : 'Form families'}</button>
          </>}>
          <div className="mgr-form">
            <p>{eligible} active {eligible === 1 ? 'student' : 'students'} will be shared randomly into families. Each family gets a similar mix of years of study and genders. Current family assignments are replaced.</p>
            <div className="adm-field"><label htmlFor="mgr-count">Number of families</label>
              <input id="mgr-count" type="number" min="1" max="200" value={count} onChange={(e) => setCount(e.target.value)} />
              <small>About {count > 0 ? Math.ceil(eligible / count) : 0} members in each family. Suggested: {suggested}.</small>
            </div>
          </div>
        </Modal>
      )}

      {renaming && (
        <Modal title="Rename family" small onClose={() => setRenaming(null)}
          footer={<>
            {failure && <p className="adm-error" role="alert">{failure}</p>}
            <button className="adm-btn adm-btn--ghost" onClick={() => setRenaming(null)}>Cancel</button>
            <button className="adm-btn adm-btn--primary" onClick={saveRename} disabled={busy}><LuCheck aria-hidden="true" />Save</button>
          </>}>
          <div className="mgr-form"><div className="adm-field"><label htmlFor="mgr-name">Family name</label><input id="mgr-name" value={renaming.name} onChange={(e) => setRenaming({ ...renaming, name: e.target.value })} autoFocus /></div></div>
        </Modal>
      )}

      {removing && (
        <div className="adm-modal" role="alertdialog" aria-modal="true" aria-label="Confirm remove">
          <button className="adm-modal__scrim" aria-label="Cancel" onClick={() => setRemoving(null)} tabIndex={-1} />
          <div className="adm-modal__box adm-modal__box--sm">
            <div className="adm-modal__body adm-confirm">
              <LuTriangleAlert aria-hidden="true" />
              <h2>Remove this member?</h2>
              <p><b>{removing.fullName}</b> and their account will be deleted. This cannot be undone.</p>
              {failure && <p className="adm-error" role="alert">{failure}</p>}
            </div>
            <footer>
              <button className="adm-btn adm-btn--ghost" onClick={() => setRemoving(null)}>Cancel</button>
              <button className="adm-btn adm-btn--danger" onClick={remove} disabled={busy}><LuTrash2 aria-hidden="true" />Remove</button>
            </footer>
          </div>
        </div>
      )}

      {toast && <div className="adm-toast" role="status"><LuCheck aria-hidden="true" />{toast}</div>}
    </>
  );
}
