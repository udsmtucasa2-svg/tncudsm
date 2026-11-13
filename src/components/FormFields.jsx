import './FormFields.css';
// Small set of form controls used by registration and the member dashboard.
export function Input({ label, hint, required, ...props }) {
  return (
    <label className="field">
      <span>{label}{required && <em> *</em>}</span>
      <input {...props} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Select({ label, options, placeholder = 'Select', required, hint, ...props }) {
  return (
    <label className="field">
      <span>{label}{required && <em> *</em>}</span>
      <select {...props}>
        <option value="">{placeholder}</option>
        {options.map((o) => (Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o} value={o}>{o}</option>))}
      </select>
      {hint && <small>{hint}</small>}
    </label>
  );
}

// Big selectable cards, e.g. "Register as".
export function ChoiceCards({ label, options, value, onChange }) {
  return (
    <fieldset className="choices">
      <legend>{label}</legend>
      <div className="choices__grid">
        {options.map((o) => (
          <label key={o.key} className={`choice ${value === o.key ? 'is-on' : ''}`}>
            <input type="radio" name="choice" value={o.key} checked={value === o.key} onChange={() => onChange(o.key)} />
            <b>{o.label}</b>
            <small>{o.note}</small>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Avatar({ name, photo, size = 'md' }) {
  const text = (name || '?').split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  return <span className={`avatar avatar--${size}`}>{photo ? <img src={photo} alt="" /> : text}</span>;
}
