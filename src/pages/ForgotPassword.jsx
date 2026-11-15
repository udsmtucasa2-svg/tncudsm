import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { AuthShell, Field, PasswordField, useAuthForm } from './Auth.jsx';
import { api, isLocalMode } from '../services/api.js';
import './Auth.css';

// Step 1: the person enters the phone number or email they registered with.
// The backend sends a reset link. The answer is always the same, so nobody can use this
// page to find out who has an account.
export function ForgotPassword() {
  const [sent, setSent] = useState(null);
  const f = useAuthForm({ identifier: '' }, api.forgotPassword, (res) => setSent(res || { ok: true }));

  if (sent) return (
    <AuthShell title="Check your messages" subtitle="If an account exists for that phone number or email, we have sent a link to reset the password. The link works for 30 minutes.">
      {isLocalMode && sent.previewToken && (
        <p className="auth__preview">
          Local preview: no email is sent. Use this link instead:{' '}
          <Link to={`/reset-password?token=${sent.previewToken}`}>Reset my password</Link>
        </p>
      )}
      <p className="auth__alt">No email on your account? <Link to="/contact">Contact us</Link> and an admin will help you.</p>
      <div className="gap-top"><Button block variant="outline" to="/login">Back to sign in</Button></div>
    </AuthShell>
  );

  return (
    <AuthShell title="Forgot your password?" subtitle="Enter the phone number or email you registered with and we will send you a reset link." footer={<Link to="/login">Back to sign in</Link>}>
      <form onSubmit={f.submit}>
        <Field label="Phone number or email" type="text" inputMode="email" autoComplete="username" placeholder="0712 345 678 or you@example.com" value={f.form.identifier} onChange={f.set('identifier')} />
        {f.error && <p className="form-error" role="alert">{f.error}</p>}
        <button className="btn btn--primary btn--block" type="submit" disabled={f.busy}><span>{f.busy ? 'Sending...' : 'Send reset link'}</span></button>
      </form>
    </AuthShell>
  );
}

// Step 2: the link in the message opens /reset-password?token=... and the person chooses a new password.
export function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const f = useAuthForm({ password: '', confirm: '' }, async (form) => {
    if (form.password.length < 8) throw new Error('Your password must be at least 8 characters.');
    if (form.password !== form.confirm) throw new Error('The two passwords do not match.');
    return api.resetPassword({ token, password: form.password });
  }, () => setDone(true));

  if (!token) return (
    <AuthShell title="Link not valid" subtitle="This reset link is incomplete. Ask for a new one.">
      <Button block to="/forgot-password">Request a new link</Button>
    </AuthShell>
  );

  if (done) return (
    <AuthShell title="Password changed" subtitle="You can now sign in with your new password.">
      <Button block onClick={() => navigate('/login')}>Go to sign in</Button>
    </AuthShell>
  );

  return (
    <AuthShell title="Choose a new password" subtitle="Use at least 8 characters." footer={<Link to="/login">Back to sign in</Link>}>
      <form onSubmit={f.submit}>
        <PasswordField label="New password" minLength={8} autoComplete="new-password" value={f.form.password} onChange={f.set('password')} />
        <PasswordField label="Confirm new password" autoComplete="new-password" value={f.form.confirm} onChange={f.set('confirm')} />
        {f.error && (
          <p className="form-error" role="alert">
            {f.error} {/expired|invalid/i.test(f.error) && <Link to="/forgot-password">Request a new link</Link>}
          </p>
        )}
        <button className="btn btn--primary btn--block" type="submit" disabled={f.busy}><span>{f.busy ? 'Saving...' : 'Save new password'}</span></button>
      </form>
    </AuthShell>
  );
}