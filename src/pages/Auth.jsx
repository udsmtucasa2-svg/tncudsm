import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { BrandLogos } from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES } from '../lib/members.js';
import './Auth.css';

export function AuthShell({ title, children, footer, subtitle, wide }) {
  return (
    <section className="auth">
      <div className={`auth__box ${wide ? 'auth__box--wide' : ''}`}>
        <div className="auth__logos"><BrandLogos size="lg" tone="teal" /></div>
        <h1>{title}</h1>
        {subtitle && <p className="auth__sub">{subtitle}</p>}
        {children}
        {footer && <p className="auth__alt">{footer}</p>}
      </div>
    </section>
  );
}

// Role switch used by Login and Register. These are buttons, so they carry the button wipe effect.
export function RoleTabs({ value, onChange }) {
  return (
    <div className="role-tabs" role="tablist" aria-label="Sign in as">
      {ROLES.map((r) => (
        <button key={r.key} type="button" role="tab" aria-selected={value === r.key} className={`tab ${value === r.key ? 'active' : ''}`} onClick={() => onChange(r.key)}>{r.label}</button>
      ))}
    </div>
  );
}

export function PasswordField({ label = 'Password', ...props }) {
  const [show, setShow] = useState(false);
  return (
    <label className="field">{label}
      <span className="pw">
        <input required type={show ? 'text' : 'password'} {...props} />
        <button type="button" className="pw__toggle" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}</button>
      </span>
    </label>
  );
}

export const Field = ({ label, ...props }) => <label className="field">{label}<input required {...props} /></label>;

export function useAuthForm(initial, action, onDone) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try { onDone(await action(form)); } catch (err) { setError(err.message || 'Something went wrong. Please try again.'); }
    setBusy(false);
  };
  return { form, set, submit, error, busy };
}

export function Login() {
  const { login, user, logout } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('member');
  const f = useAuthForm({ identifier: '', password: '' }, (form) => login({ ...form, role }), (u) => navigate(u.role === 'admin' ? '/admin' : '/dashboard'));

  if (user) return (
    <AuthShell title={`Hello, ${user.name}`}>
      {user.role === 'admin' ? <Button block to="/admin">Open admin panel</Button> : <Button block to="/dashboard">Open my dashboard</Button>}
      <div className="gap-top"><Button block variant="outline" onClick={logout}>Sign out</Button></div>
    </AuthShell>
  );

  return (
    <AuthShell title="Welcome back" subtitle="Choose how you belong to TNC, then sign in." footer={<>New here? <Link to="/register">Create account</Link></>}>
      <RoleTabs value={role} onChange={setRole} />
      <form onSubmit={f.submit}>
        <Field label="Phone number or email" type="text" inputMode="email" autoComplete="username" placeholder="0712 345 678 or you@example.com" value={f.form.identifier} onChange={f.set('identifier')} />
        <PasswordField autoComplete="current-password" value={f.form.password} onChange={f.set('password')} />
        <p className="auth__forgot"><Link to="/forgot-password">Forgot password?</Link></p>
        {f.error && <p className="form-error" role="alert">{f.error}</p>}
        <button className="btn btn--primary btn--block" type="submit" disabled={f.busy}><span>{f.busy ? 'Signing in...' : `Sign in as ${ROLES.find((r) => r.key === role).label}`}</span></button>
      </form>
    </AuthShell>
  );
}