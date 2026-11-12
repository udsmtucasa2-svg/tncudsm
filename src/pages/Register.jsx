import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell, RoleTabs, PasswordField, Field } from './Auth.jsx';
import { Select } from '../components/FormFields.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES, parseIdentifier } from '../lib/members.js';

const thisYear = new Date().getFullYear();

// Sign-up is short on purpose: role, phone or email, password and year. The rest of the profile
// (name, gender, programme, church details, photo) is completed on the dashboard after the first login.
function validate(f) {
  if (!parseIdentifier(f.identifier)) return 'Enter a valid phone number or email.';
  if (f.category === 'member' && !f.yearOfStudy) return 'Please select your current year of study.';
  if (f.category === 'alumni' && !f.completionYear) return 'Please select the year you completed your studies.';
  if (f.password.length < 8) return 'Your password must be at least 8 characters.';
  if (f.password !== f.confirm) return 'The two passwords do not match.';
  return '';
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ category: 'member', identifier: '', yearOfStudy: '', completionYear: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => { setError(''); setF((s) => ({ ...s, [k]: e.target.value })); };
  const years = useMemo(() => Array.from({ length: 30 }, (_, i) => String(thisYear - i)), []);

  const submit = async (e) => {
    e.preventDefault();
    const m = validate(f);
    if (m) { setError(m); return; }
    setBusy(true);
    setError('');
    try {
      await register({ category: f.category, identifier: f.identifier, password: f.password, yearOfStudy: f.yearOfStudy, completionYear: f.completionYear });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="It takes a minute. You will complete your profile after signing in." footer={<>Already registered? <Link to="/login">Sign in</Link></>}>
      <RoleTabs value={f.category} onChange={(v) => { setError(''); setF((s) => ({ ...s, category: v })); }} />
      <form onSubmit={submit} noValidate>
        <Field label="Phone number or email" type="text" inputMode="email" autoComplete="username" placeholder="0712 345 678 or you@example.com" value={f.identifier} onChange={set('identifier')} />
        {f.category === 'member' && <Select label="Current year of study" required value={f.yearOfStudy} onChange={set('yearOfStudy')} options={[1, 2, 3, 4, 5, 6].map((y) => [String(y), `Year ${y}`])} />}
        {f.category === 'alumni' && <Select label="Year you completed your studies" required value={f.completionYear} onChange={set('completionYear')} options={years} />}
        <PasswordField label="Password (at least 8 characters)" minLength={8} autoComplete="new-password" value={f.password} onChange={set('password')} />
        <PasswordField label="Confirm password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn--primary btn--block" disabled={busy}><span>{busy ? 'Creating account...' : `Create ${ROLES.find((r) => r.key === f.category).label} account`}</span></button>
      </form>
    </AuthShell>
  );
}
