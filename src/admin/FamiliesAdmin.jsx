import { useState } from 'react';
import { LuShuffle, LuCheck, LuX, LuPencil, LuGraduationCap, LuUserPlus, LuUsers, LuFlaskConical } from 'react-icons/lu';
import { api, isLocalMode } from '../services/api.js';
import { useFetch } from '../hooks.js';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import { Avatar } from '../components/FormFields.jsx';
import { familyStats, eligibleMembers } from '../lib/families.js';
import { currentYearOfStudy } from '../lib/members.js';

async function loadAll() {
  const [members, families] = await Promise.all([api.admin.list('members'), api.admin.list('families')]);
  return { members, families };
}

function Composition({ stats }) {
  const years = Object.keys(stats.byYear).sort();
  return (
    <div className="fam-comp">
      <span>{stats.male} male</span><span>{stats.female} female</span>
      {years.map((y) => <span key={y}>Y{y}: {stats.byYear[y]}</span>)}
    </div>
  );
}

function FamilyCard({ name, people, onRename }) {
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState(name);
  const stats = familyStats(people);
  const save = () => { if (val.trim() && val.trim() !== name) onRename(val.trim()); setEdit(false); };
  return (
    <article className="adm-card fam-card">
      <header>
        {edit ? (
          <span className="fam-card__edit"><input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} autoFocus aria-label="Family name" /><button className="adm-icon" onClick={save} aria-label="Save name"><LuCheck aria-hidden="true" /></button></span>
        ) : (
          <h3>Family {name}{onRename && <button className="adm-icon" onClick={() => setEdit(true)} aria-label={`Rename family ${name}`}><LuPencil aria-hidden="true" /></button>}</h3>
        )}
        <span className="adm-pill adm-pill--muted">{people.length}</span>
      </header>
      <Composition stats={stats} />
      <ul>
        {[...people].sort((a, b) => (currentYearOfStudy(a) || 0) - (currentYearOfStudy(b) || 0)).map((p) => (
          <li key={p.id}><Avatar name={p.fullName} photo={p.photo} /><span><b>{p.fullName}</b><small>{p.gender} · Year {currentYearOfStudy(p) || '-'}{p.program ? ` · ${p.program}` : ''}</small></span></li>
        ))}
      </ul>
    </article>
  );
}

export default function FamiliesAdmin() {
  const { data, loading, error, reload } = useFetch(loadAll, null);
  const [size, setSize] = useState(8);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  if (loading && !data) return <Loader />;
  if (error || !data) return <ErrorNotice onRetry={reload}>We could not load the families.</ErrorNotice>;
  const { members, families } = data;
  const byId = Object.fromEntries(members.map((m) => [m.id, m]));
  const eligible = eligibleMembers(members);
  const unassigned = eligible.filter((m) => !m.familyId);

  const run = async (fn, done) => {
    setBusy(true); setErr(''); setMsg('');
    try { const r = await fn(); setMsg(done(r)); await reload(); } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const makePreview = async () => {
    setBusy(true); setErr(''); setMsg('');
    try { setPreview(await api.admin.previewFamilies(Number(size) || 8)); } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  const apply = () => run(() => api.admin.applyFamilies(preview.map((f) => ({ name: f.name, memberIds: f.memberIds }))), (r) => `${r.families ?? preview.length} families saved.`).then(() => setPreview(null));

  return (
    <>
      <div className="adm-head">
        <div><h1>Families</h1><p>Students are placed into families at random, mixing years of study and gender evenly. When a student finishes their programme they leave the family and become Alumni.</p></div>
        <button className="adm-btn adm-btn--ghost" disabled={busy} onClick={() => run(api.admin.syncGraduations, (r) => (r.moved ? `${r.moved} graduate(s) moved to Alumni and removed from their families.` : 'No one has finished their studies yet.'))}><LuGraduationCap aria-hidden="true" />Run graduation check</button>
      </div>

      {msg && <div className="adm-success" role="status"><LuCheck aria-hidden="true" />{msg}</div>}
      {err && <p className="adm-error" role="alert">{err}</p>}

      <div className="adm-card">
        <h2>Form families</h2>
        <p className="adm-muted">{eligible.length} students are eligible (approved Members and Leaders who are still studying). Choose a family size and preview the result before saving. Saving replaces the current families.</p>
        <div className="adm-actions">
          <label className="adm-inline">People per family<input type="number" min="3" max="30" value={size} onChange={(e) => setSize(e.target.value)} /></label>
          <button className="adm-btn adm-btn--primary" onClick={makePreview} disabled={busy || eligible.length === 0}><LuShuffle aria-hidden="true" />{preview ? 'Shuffle again' : 'Preview families'}</button>
          {unassigned.length > 0 && families.length > 0 && <button className="adm-btn adm-btn--ghost" disabled={busy} onClick={() => run(api.admin.assignUnassigned, (r) => `${r.assigned} student(s) added to the smallest, best-matching families.`)}><LuUserPlus aria-hidden="true" />Place {unassigned.length} new student{unassigned.length > 1 ? 's' : ''}</button>}
          {isLocalMode && <button className="adm-btn adm-btn--ghost" disabled={busy} onClick={() => run(() => api.admin.addSampleMembers(24), (r) => `${r.added} sample members added (preview only).`)}><LuFlaskConical aria-hidden="true" />Add 24 sample members</button>}
        </div>
      </div>

      {preview && (
        <section className="fam-preview">
          <div className="fam-preview__bar">
            <b>Preview: {preview.length} families, {eligible.length} students</b>
            <span>
              <button className="adm-btn adm-btn--ghost" onClick={() => setPreview(null)} disabled={busy}><LuX aria-hidden="true" />Discard</button>{' '}
              <button className="adm-btn adm-btn--primary" onClick={apply} disabled={busy}><LuCheck aria-hidden="true" />Save these families</button>
            </span>
          </div>
          <div className="fam-grid">{preview.map((f) => <FamilyCard key={f.name} name={f.name} people={f.memberIds.map((id) => byId[id]).filter(Boolean)} />)}</div>
        </section>
      )}

      {!preview && (families.length === 0 ? (
        <div className="adm-card"><div className="adm-empty"><LuUsers aria-hidden="true" /><p>No families yet. Preview and save to create them.</p></div></div>
      ) : (
        <>
          <h2 className="adm-sub">Current families ({families.length})</h2>
          <div className="fam-grid">
            {families.map((f) => <FamilyCard key={f.id} name={f.name} people={members.filter((m) => m.familyId === f.id)} onRename={(name) => run(() => api.admin.renameFamily(f.id, name), () => 'Family renamed.')} />)}
          </div>
        </>
      ))}
    </>
  );
}
