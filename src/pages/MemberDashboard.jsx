import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { LuCamera, LuPencil, LuX, LuCheck, LuUsers, LuGraduationCap, LuUser, LuCross, LuLogOut, LuLayoutDashboard } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import Button from '../components/Button.jsx';
import { Avatar, Input, Select } from '../components/FormFields.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { catLabel, completeness, currentYearOfStudy, isStudent, ordinal } from '../lib/members.js';
import './MemberDashboard.css';

const Row = ({ label, children }) => <div><dt>{label}</dt><dd>{children || <span className="muted">Not added</span>}</dd></div>;

function EditForm({ m, onClose, onSaved }) {
  const student = isStudent(m);
  const [f, setF] = useState({
    fullName: m.fullName || '', email: m.email || '', gender: m.gender || '', address: m.address || '', phone: m.phone || '',
    baptized: m.baptized ? 'Yes' : 'No', baptizedChurch: m.baptizedChurch || '', program: m.program || '', institution: m.institution || '',
    programDuration: String(m.programDuration || ''), yearOfStudy: String(currentYearOfStudy(m) || ''), organisation: m.organisation || '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const years = Array.from({ length: Number(f.programDuration) || 6 }, (_, i) => String(i + 1));

  const save = async (e) => {
    e.preventDefault();
    if (!f.fullName.trim()) return setError('Please enter your full name.');
    if (!f.gender) return setError('Please select your gender.');
    if (f.baptized === 'Yes' && !f.baptizedChurch.trim()) return setError('Please enter the church where you were baptized.');
    if (student && Number(f.yearOfStudy) > Number(f.programDuration)) return setError('Your year of study cannot be more than the programme duration.');
    setBusy(true);
    setError('');
    try {
      const patch = { ...f, baptized: f.baptized === 'Yes' };
      if (!student) { delete patch.programDuration; delete patch.yearOfStudy; }
      await api.member.update(patch);
      onSaved();
    } catch (err) { setError(err.message || 'Could not save your changes.'); setBusy(false); }
  };

  return (
    <form className="card profile-edit" onSubmit={save} noValidate>
      <h2>{m.fullName ? 'Edit my details' : 'Complete your profile'}</h2>
      <div className="field-row"><Input label="Full name" required value={f.fullName} onChange={set('fullName')} /><Select label="Gender" value={f.gender} onChange={set('gender')} options={['Male', 'Female']} /></div>
      <div className="field-row"><Input label="Phone" type="tel" value={f.phone} onChange={set('phone')} /><Input label="Email" type="email" value={f.email} onChange={set('email')} /></div>
      <Input label="Address" value={f.address} onChange={set('address')} placeholder="Hostel, street or area where you live" />
      <div className="field-row">
        <Select label="Are you baptized?" value={f.baptized} onChange={set('baptized')} options={['Yes', 'No']} />
        {f.baptized === 'Yes' && <Input label="Church where you were baptized" value={f.baptizedChurch} onChange={set('baptizedChurch')} />}
      </div>
      {student && (
        <>
          <div className="field-row"><Input label="University or college" value={f.institution} onChange={set('institution')} /><Input label="Programme of study" value={f.program} onChange={set('program')} /></div>
          <div className="field-row">
            <Select label="Programme duration" value={f.programDuration} onChange={set('programDuration')} options={[2, 3, 4, 5, 6].map((n) => [String(n), `${n} years`])} />
            <Select label="Current year of study" value={f.yearOfStudy} onChange={set('yearOfStudy')} options={years.map((y) => [y, `Year ${y}`])} />
          </div>
        </>
      )}
      {m.category === 'associate' && <Input label="Organisation or church" value={f.organisation} onChange={set('organisation')} />}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="wizard-nav">
        <button type="button" className="btn btn--outline" onClick={onClose}><LuX aria-hidden="true" /><span>Cancel</span></button>
        <button type="submit" className="btn btn--primary" disabled={busy}><LuCheck aria-hidden="true" /><span>{busy ? 'Saving...' : 'Save changes'}</span></button>
      </div>
    </form>
  );
}

export default function MemberDashboard() {
  const { user, ready, isAdmin, logout } = useAuth();
  const { data: m, loading, error, reload } = useFetch(user && !isAdmin ? api.member.get : () => Promise.resolve(null), null);
  const [editing, setEditing] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [asked, setAsked] = useState(false);

  useEffect(() => { if (user && !isAdmin) reload(); }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // First login: the account only has role, phone/email and year, so open the profile form straight away.
  useEffect(() => { if (m && !asked) { setAsked(true); if (!m.fullName) setEditing(true); } }, [m, asked]);

  if (!ready) return <section className="section container"><Loader /></section>;
  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (!m) return <section className="section container">{error ? <ErrorNotice onRetry={reload} /> : <Loader />}</section>;

  const student = isStudent(m);
  const year = currentYearOfStudy(m);
  const { percent, missing } = completeness(m);

  const changePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true); setPhotoError('');
    try { await api.member.update({ photo: await api.member.uploadPhoto(file) }); reload(); } catch (err) { setPhotoError(err.message); }
    setPhotoBusy(false);
    e.target.value = '';
  };

  return (
    <>
      <PageBanner title="My Dashboard" subtitle={m.fullName ? `Welcome, ${m.fullName.split(' ')[0]}` : 'Welcome to TNC. Please complete your profile.'} />
      <section className="section">
        <div className="container container--dash">
          <div className="card profile-head">
            <div className="profile-head__photo">
              <Avatar name={m.fullName || m.email || 'N'} photo={m.photo} size="xl" />
              <label className="photo-btn" title="Change profile photo">
                <LuCamera aria-hidden="true" /><span className="sr-only">Change profile photo</span>
                <input type="file" accept="image/*" onChange={changePhoto} hidden disabled={photoBusy} />
              </label>
            </div>
            <div className="profile-head__info">
              <h2>{m.fullName || 'New member'}</h2>
              <p><span className="badge">{catLabel(m.category)}</span>{m.isLeader && <span className="badge">Leader{m.leaderPosition ? `: ${m.leaderPosition}` : ''}</span>}{student && year && <span className="badge">{ordinal(year)}</span>}{m.family && <span className="badge">Family {m.family.name}</span>}</p>
              <p className="muted">{[m.email, m.phone].filter(Boolean).join(' · ')}</p>
              {photoError && <p className="form-error">{photoError}</p>}
            </div>
            <div className="profile-head__meter">
              <div className="meter"><i style={{ width: `${percent}%` }} /></div>
              <small>{percent === 100 ? 'Your profile is complete' : `Profile ${percent}% complete`}</small>
              {percent < 100 && <small className="muted">Add: {missing.map((k) => ({ fullName: 'name', gender: 'gender', address: 'address', phone: 'phone', photo: 'a photo', program: 'programme', yearOfStudy: 'year of study', programDuration: 'duration', baptizedChurch: 'baptism church' }[k] || k)).join(', ')}</small>}
            </div>
            <div className="profile-head__actions">
              {!editing && <button className="btn btn--outline btn--sm" onClick={() => setEditing(true)}><LuPencil aria-hidden="true" /><span>Edit details</span></button>}
            </div>
          </div>

          {editing && <EditForm m={m} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); reload(); }} />}

          <div className="dash-grid">
            <div className="card">
              <h3><LuUser aria-hidden="true" />Personal details</h3>
              <dl className="kv">
                <Row label="Gender">{m.gender}</Row>
                <Row label="Phone">{m.phone}</Row>
                <Row label="Address">{m.address}</Row>
              </dl>
            </div>
            <div className="card">
              <h3><LuCross aria-hidden="true" />Church</h3>
              <dl className="kv">
                <Row label="Baptized">{m.baptized ? 'Yes' : 'No'}</Row>
                {m.baptized && <Row label="Baptized at">{m.baptizedChurch}</Row>}
                {m.isLeader && <Row label="Leadership">{m.leaderPosition || 'Leader'}</Row>}
                {m.organisation && <Row label="Organisation">{m.organisation}</Row>}
              </dl>
            </div>
            {(student || m.category === 'alumni') && (
              <div className="card">
                <h3><LuGraduationCap aria-hidden="true" />Studies</h3>
                <dl className="kv">
                  <Row label="Institution">{m.institution}</Row>
                  <Row label="Programme">{m.program}</Row>
                  {student && <Row label="Year of study">{ordinal(year)} of {m.programDuration}</Row>}
                  <Row label={m.category === 'alumni' ? 'Completed' : 'Expected completion'}>{m.graduationYear && (m.category === 'alumni' ? m.graduationYear : `July ${m.graduationYear}`)}</Row>
                </dl>
              </div>
            )}
          </div>

          {student && (
            <div className="card family">
              <h3><LuUsers aria-hidden="true" />My family</h3>
              {m.family ? (
                <>
                  <p className="family__name">Family {m.family.name}<small>{m.family.members.length} members</small></p>
                  <ul className="family__list">
                    {m.family.members.map((p) => (
                      <li key={p.id} className={p.id === m.id ? 'is-me' : ''}>
                        <Avatar name={p.fullName} photo={p.photo} />
                        <span><b>{p.fullName}{p.id === m.id && ' (you)'}</b><small>{p.year ? `Year ${p.year}` : ''}{p.program ? ` · ${p.program}` : ''}</small></span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="muted">Families are formed by the administrators. You will see your family here as soon as you are placed.</p>
              )}
              <p className="family__note">When your programme ends in July {m.graduationYear}, you move from the family to the Alumni list.</p>
            </div>
          )}

          {m.category === 'alumni' && <div className="card"><h3><LuGraduationCap aria-hidden="true" />Alumni</h3><p className="muted">Thank you for the time you served with us. Stay connected through our events and sermons.</p><Button to="/events" variant="outline">See events</Button></div>}

          <div className="dash-foot"><button className="btn btn--outline btn--sm" onClick={logout}><LuLogOut aria-hidden="true" /><span>Sign out</span></button></div>
        </div>
      </section>
    </>
  );
}
