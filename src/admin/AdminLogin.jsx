import { Navigate, Link, useNavigate } from 'react-router-dom';
import { LuLock } from 'react-icons/lu';
import { AuthShell, Field, useAuthForm } from '../pages/Auth.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { isLocalMode } from '../services/api.js';

export default function AdminLogin() {
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const f = useAuthForm({ email: '', password: '' }, login, (u) => {
    if (u.role !== 'admin') throw new Error('This account is not an administrator.');
    navigate('/admin');
  });

  if (user && isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="adm-login">
      <AuthShell title="Admin sign in" subtitle="Manage the TNC UDSM website" footer={<Link to="/">Back to website</Link>}>
        <form onSubmit={f.submit}>
          <Field label="Email" type="email" autoComplete="username" value={f.form.email} onChange={f.set('email')} />
          <Field label="Password" type="password" autoComplete="current-password" value={f.form.password} onChange={f.set('password')} />
          {user && !isAdmin && <p className="form-error" role="alert">You are signed in, but this account is not an administrator.</p>}
          {f.error && <p className="form-error" role="alert">{f.error}</p>}
          <button className="btn btn--primary btn--block" type="submit" disabled={f.busy}><LuLock aria-hidden="true" /><span>{f.busy ? 'Signing in...' : 'Sign in'}</span></button>
        </form>
        {isLocalMode && <p className="adm-login__hint">Local preview: sign in as <b>admin@tncudsm.com</b> with the password set in <code>VITE_LOCAL_ADMIN_PASSWORD</code> (default <code>admin123</code>).</p>}
      </AuthShell>
    </div>
  );
}
