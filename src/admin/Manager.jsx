import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { LuPlus, LuPencil, LuTrash2, LuSearch, LuX, LuCheck, LuUpload, LuImage, LuTriangleAlert } from 'react-icons/lu';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import { RESOURCES } from './config.js';

// ---------- one form field ----------
function FieldInput({ field, value, onChange, onError }) {
  const [busy, setBusy] = useState(false);
  const id = `f-${field.name}`;
  const common = { id, name: field.name, required: field.required, placeholder: field.placeholder };

  let control;
  if (field.type === 'textarea') {
    control = <textarea {...common} rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  } else if (field.type === 'select') {
    control = (
      <select {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {field.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    );
  } else if (field.type === 'checkbox') {
    return (
      <label className="adm-check adm-field--wide" htmlFor={id}>
        <input id={id} type="checkbox" checked={value !== false && Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        <span>{field.label}</span>
      </label>
    );
  } else if (field.type === 'image') {
    const pick = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setBusy(true);
      try { onChange(await api.admin.upload(file)); } catch (err) { onError(err.message); }
      setBusy(false);
      e.target.value = '';
    };
    control = (
      <div className="adm-image">
        <div className="adm-image__preview">{value ? <img src={value} alt="" /> : <LuImage aria-hidden="true" />}</div>
        <div className="adm-image__actions">
          <label className="adm-btn adm-btn--ghost">
            <LuUpload aria-hidden="true" />{busy ? 'Uploading...' : value ? 'Replace' : 'Upload'}
            <input type="file" accept="image/*" onChange={pick} hidden />
          </label>
          {value && <button type="button" className="adm-btn adm-btn--ghost" onClick={() => onChange(null)}>Remove</button>}
        </div>
      </div>
    );
  } else {
    control = <input {...common} type={field.type} value={value ?? ''} onChange={(e) => onChange(field.type === 'number' ? e.target.value.replace(/[^\d]/g, '') : e.target.value)} />;
  }

  return (
    <div className={`adm-field ${field.wide ? 'adm-field--wide' : ''}`}>
      <label htmlFor={id}>{field.label}{field.required && <em> *</em>}</label>
      {control}
      {field.hint && <small>{field.hint}</small>}
    </div>
  );
}

// ---------- modal form ----------
function FormModal({ cfg, initial, onClose, onSave }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const editing = initial.id != null;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    ref.current?.querySelector('input:not([type=hidden]), select, textarea')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    for (const f of cfg.fields) {
      if (f.required && !String(values[f.name] ?? '').trim()) { setError(`${f.label} is required.`); return; }
    }
    setSaving(true);
    setError('');
    try {
      const payload = { ...values };
      if (payload.order !== undefined && payload.order !== '') payload.order = Number(payload.order);
      await onSave(payload);
    } catch (err) {
      setError(err.message || 'Could not save. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="adm-modal" role="dialog" aria-modal="true" aria-label={`${editing ? 'Edit' : 'New'} ${cfg.singular}`} ref={ref}>
      <button className="adm-modal__scrim" aria-label="Close" onClick={onClose} tabIndex={-1} />
      <form className="adm-modal__box" onSubmit={submit} noValidate>
        <header><h2>{editing ? 'Edit' : 'New'} {cfg.singular.toLowerCase()}</h2><button type="button" onClick={onClose} aria-label="Close"><LuX aria-hidden="true" /></button></header>
        <div className="adm-modal__body">
          {cfg.fields.map((f) => (
            <FieldInput key={f.name} field={f} value={values[f.name]} onError={setError} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
          ))}
        </div>
        <footer>
          {error && <p className="adm-error" role="alert">{error}</p>}
          <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="adm-btn adm-btn--primary" disabled={saving}><LuCheck aria-hidden="true" />{saving ? 'Saving...' : 'Save'}</button>
        </footer>
      </form>
    </div>
  );
}

// ---------- the page ----------
function Manager({ name }) {
  const cfg = RESOURCES[name];
  const [params, setParams] = useSearchParams();
  const { data, loading, error, reload } = useFetch(() => api.admin.list(name));
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState(params.get('new') && cfg.canCreate ? { ...cfg.blank } : null);
  const [removing, setRemoving] = useState(null);
  const [toast, setToast] = useState('');
  const [failure, setFailure] = useState('');

  useEffect(() => { if (params.get('new')) setParams({}, { replace: true }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const rows = useMemo(() => {
    let list = [...data];
    if (cfg.sort) list.sort(cfg.sort);
    if (filter) list = list.filter((r) => r[cfg.filter.field] === filter);
    const needle = q.trim().toLowerCase();
    if (needle) list = list.filter((r) => JSON.stringify(Object.values(r).filter((v) => typeof v === 'string' && !v.startsWith('data:'))).toLowerCase().includes(needle));
    return list;
  }, [data, q, filter, cfg]);

  const save = async (payload) => {
    if (payload.id != null) await api.admin.update(name, payload.id, payload);
    else await api.admin.create(name, payload);
    setToast(`${cfg.singular} saved`);
    setEditing(null);
    reload();
  };

  const remove = async () => {
    try {
      await api.admin.remove(name, removing.id);
      setToast(`${cfg.singular} deleted`);
      setFailure('');
      setRemoving(null);
      reload();
    } catch (err) {
      setFailure(err.message || 'Could not delete.');
    }
  };

  const Icon = cfg.icon;
  const statusClass = (s) => (s === 'Published' ? 'ok' : s === 'Hidden' ? 'muted' : 'warn');

  return (
    <>
      <div className="adm-head">
        <div><h1>{cfg.label}</h1><p>{cfg.description}</p></div>
        {cfg.canCreate && <button className="adm-btn adm-btn--primary" onClick={() => setEditing({ ...cfg.blank })}><LuPlus aria-hidden="true" />New {cfg.singular.toLowerCase()}</button>}
      </div>

      <div className="adm-card adm-card--flush">
        <div className="adm-toolbar">
          <label className="adm-search"><LuSearch aria-hidden="true" /><input type="search" placeholder={`Search ${cfg.label.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" /></label>
          {cfg.filter && (
            <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter">
              <option value="">{cfg.filter.label}</option>
              {cfg.filter.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          )}
          <span className="adm-count">{rows.length} {rows.length === 1 ? 'item' : 'items'}</span>
        </div>

        {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload}>{error.message}</ErrorNotice> : rows.length === 0 ? (
          <div className="adm-empty"><Icon aria-hidden="true" /><p>{data.length === 0 ? `No ${cfg.label.toLowerCase()} yet.` : 'Nothing matches your search.'}</p>
            {data.length === 0 && cfg.canCreate && <button className="adm-btn adm-btn--primary" onClick={() => setEditing({ ...cfg.blank })}><LuPlus aria-hidden="true" />Add the first one</button>}
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>{cfg.singular}</th>{cfg.columns.map((c) => <th key={c.label}>{c.label}</th>)}<th className="adm-th-actions"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="adm-cell">
                        {cfg.imageKey !== undefined && <span className="adm-thumb">{r[cfg.imageKey] ? <img src={r[cfg.imageKey]} alt="" loading="lazy" /> : <Icon aria-hidden="true" />}</span>}
                        <div><b className={cfg.title(r) === 'Not yet entered' ? 'adm-dim' : ''}>{cfg.title(r)}</b>{cfg.subtitle && <small>{cfg.subtitle(r)}</small>}</div>
                      </div>
                    </td>
                    {cfg.columns.map((c) => (
                      <td key={c.label}>{c.status ? <span className={`adm-pill adm-pill--${statusClass(c.status(r))}`}>{c.status(r)}</span> : c.render(r)}</td>
                    ))}
                    <td className="adm-td-actions">
                      <button className="adm-icon" onClick={() => setEditing({ ...cfg.blank, ...r })} aria-label={`Edit ${cfg.title(r)}`} title="Edit"><LuPencil aria-hidden="true" /></button>
                      {cfg.canDelete && <button className="adm-icon adm-icon--danger" onClick={() => { setFailure(''); setRemoving(r); }} aria-label={`Delete ${cfg.title(r)}`} title="Delete"><LuTrash2 aria-hidden="true" /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && <FormModal cfg={cfg} initial={editing} onClose={() => setEditing(null)} onSave={save} />}

      {removing && (
        <div className="adm-modal" role="alertdialog" aria-modal="true" aria-label="Confirm delete">
          <button className="adm-modal__scrim" aria-label="Cancel" onClick={() => setRemoving(null)} tabIndex={-1} />
          <div className="adm-modal__box adm-modal__box--sm">
            <div className="adm-modal__body adm-confirm">
              <LuTriangleAlert aria-hidden="true" />
              <h2>Delete this {cfg.singular.toLowerCase()}?</h2>
              <p><b>{cfg.title(removing)}</b> will be removed from the website. This cannot be undone.</p>
              {failure && <p className="adm-error" role="alert">{failure}</p>}
            </div>
            <footer>
              <button className="adm-btn adm-btn--ghost" onClick={() => setRemoving(null)}>Cancel</button>
              <button className="adm-btn adm-btn--danger" onClick={remove}><LuTrash2 aria-hidden="true" />Delete</button>
            </footer>
          </div>
        </div>
      )}

      {toast && <div className="adm-toast" role="status"><LuCheck aria-hidden="true" />{toast}</div>}
    </>
  );
}

// Re-mounts the manager when the section changes so search/filter state resets.
export default function ManagerRoute() {
  const { resource } = useParams();
  if (!RESOURCES[resource]) return <Navigate to="/admin" replace />;
  return <Manager key={resource} name={resource} />;
}
