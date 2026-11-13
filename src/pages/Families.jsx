import { LuHouse, LuHeartHandshake } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import './Families.css';

export default function Families() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(api.getFamilies);
  return (
    <>
      <PageBanner title="Family & Prayer Groups" subtitle="Small groups where nobody walks alone" />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Belong" title="Our families" />
          <p className="lead">Every student member belongs to a TNC family: a small group that prays, studies and supports one another through university life. Families are arranged by the leaders at the start of each academic year.</p>
          {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload} /> : data.length === 0 ? (
            <EmptyState icon={LuHouse} title="Families are being arranged">Register as a member and you will be placed in a family when they are formed.</EmptyState>
          ) : (
            <div className="family-chips">
              {data.map((f, i) => <Reveal key={f.id} delay={(i % 6) * 40}><span className="family-chip"><LuHouse aria-hidden="true" />{f.name}</span></Reveal>)}
            </div>
          )}
          <div className="center-row">
            {user
              ? <Button to="/dashboard" variant="primary" arrow>See my family</Button>
              : <Button to="/register" variant="gold" arrow>Join TNC</Button>}
            <Button to="/prayer-request" variant="outline"><LuHeartHandshake aria-hidden="true" /> Submit a prayer request</Button>
          </div>
        </div>
      </section>
    </>
  );
}
