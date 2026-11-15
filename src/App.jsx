import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Loader from './components/Loader.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Departments from './pages/Departments.jsx';
import DepartmentDetail from './pages/DepartmentDetail.jsx';
import Leadership from './pages/Leadership.jsx';
import Gallery from './pages/Gallery.jsx';
import Resources from './pages/Resources.jsx';
import Events from './pages/Events.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Sermons from './pages/Sermons.jsx';
import NotFound from './pages/NotFound.jsx';
import { Login } from './pages/Auth.jsx';
import Register from './pages/Register.jsx';
import MemberDashboard from './pages/MemberDashboard.jsx';
import Choir from './pages/Choir.jsx';
import Families from './pages/Families.jsx';
import News from './pages/News.jsx';
import Sports from './pages/Sports.jsx';
import Alumni from './pages/Alumni.jsx';
import Contact from './pages/Contact.jsx';
import BibleStudy from './pages/BibleStudy.jsx';
import PrayerRequest from './pages/PrayerRequest.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import Dashboard from './admin/Dashboard.jsx';
import Manager from './admin/Manager.jsx';
import MembersAdmin from './admin/MembersAdmin.jsx';
import FamiliesAdmin from './admin/FamiliesAdmin.jsx';
import { ForgotPassword, ResetPassword } from './pages/ForgotPassword.jsx';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Braces matter: window.scrollTo() returns a Promise in modern Chrome, and React
    // treats anything an effect returns as its cleanup function.
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

const SEEN_KEY = 'tnc-splash-seen';
const alreadySeen = () => {
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
};

function PublicSite() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/:slug" element={<DepartmentDetail />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/library" element={<Resources />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/choir" element={<Choir />} />
          <Route path="/families" element={<Families />} />
          <Route path="/news" element={<News />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/bible-study" element={<BibleStudy />} />
          <Route path="/prayer-request" element={<PrayerRequest />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<MemberDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  // The branded splash plays once per browser session, not on every refresh.
  const [loading, setLoading] = useState(() => !alreadySeen());
  const { pathname } = useLocation();
  const inAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (!loading) return undefined;
    const t = setTimeout(() => {
      try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage blocked: ignore */ }
      setLoading(false);
    }, 1000);
    return () => clearTimeout(t);
  }, [loading]);

  if (loading) return <Loader fullscreen />;

  return (
    <>
      <ScrollToTop />
      {inAdmin ? (
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<MembersAdmin />} />
            <Route path="families" element={<FamiliesAdmin />} />
            <Route path=":resource" element={<Manager />} />
          </Route>
        </Routes>
      ) : <PublicSite />}
    </>
  );
}
