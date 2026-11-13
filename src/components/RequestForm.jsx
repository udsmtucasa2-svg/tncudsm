import { useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { Input, Select } from './FormFields.jsx';
import Button from './Button.jsx';
import { api, isLocalMode } from '../services/api.js';
import './RequestForm.css';

// One form component for Bible study requests, prayer requests and contact messages.
// fields: [{ name, label, type: text|email|tel|textarea|select|checkbox, required, hint, options, placeholder }]
export default function RequestForm({ type, fields, submitLabel = 'Send', success }) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, f.type === 'checkbox' ? false : '']));
  const [v, setV] = useState({ ...initial, website: '' }); // "website" is a hidden honeypot field
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (name) => (e) => { setError(''); setV((s) => ({ ...s, [name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })); };

  const submit = async (e) => {
    e.preventDefault();
    const missing = fields.find((f) => f.required && !String(v[f.name]).trim());
    if (missing) return setError(`Please fill in: ${missing.label}.`);
    if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) return setError('Please enter a valid email address.');
    setBusy(true);
    try {
      await api.submitRequest({ type, ...v });
      setDone(true);
    } catch {
      setError('Sorry, we could not send this right now. Please try again in a moment.');
    } finally { setBusy(false); }
  };

  if (done) {
    return (
      <div className="rform rform--done" role="status">
        <span className="rform__tick"><LuCheck aria-hidden="true" /></span>
        <h3>Thank you</h3>
        <p>{success}</p>
        <Button variant="outline" onClick={() => { setV({ ...initial, website: '' }); setDone(false); }}>Send another</Button>
      </div>
    );
  }

  return (
    <form className="rform" onSubmit={submit} noValidate>
      {isLocalMode && <p className="form-note">Preview mode: requests are saved in this browser only until the website backend is connected.</p>}
      <div className="rform__grid">
        {fields.map((f) => {
          if (f.type === 'textarea') {
            return (
              <label key={f.name} className="field field--wide">
                <span>{f.label}{f.required && <em> *</em>}</span>
                <textarea rows="5" value={v[f.name]} onChange={set(f.name)} placeholder={f.placeholder} />
                {f.hint && <small>{f.hint}</small>}
              </label>
            );
          }
          if (f.type === 'checkbox') {
            return <label key={f.name} className="check field--wide"><input type="checkbox" checked={v[f.name]} onChange={set(f.name)} /> <span>{f.label}</span></label>;
          }
          if (f.type === 'select') return <Select key={f.name} label={f.label} options={f.options} value={v[f.name]} onChange={set(f.name)} required={f.required} hint={f.hint} />;
          return <Input key={f.name} label={f.label} type={f.type || 'text'} value={v[f.name]} onChange={set(f.name)} required={f.required} hint={f.hint} placeholder={f.placeholder} />;
        })}
      </div>
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={v.website} onChange={set('website')} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <Button type="submit" variant="primary" arrow disabled={busy}>{busy ? 'Sending…' : submitLabel}</Button>
    </form>
  );
}
