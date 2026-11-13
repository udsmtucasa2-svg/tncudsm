import { useParams, Link } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import LeaderCard from '../components/LeaderCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Loader from '../components/Loader.jsx';
import ErrorNotice from '../components/ErrorNotice.jsx';
import { api } from '../services/api.js';
import { useFetch } from '../hooks.js';
import { byOrder } from '../lib/arrange.js';
import './Departments.css';

export default function DepartmentDetail() {
  const { slug } = useParams();
  const dp = useFetch(api.getDepartments);
  const ld = useFetch(api.getLeaders);

  if (dp.loading || ld.loading) return <section className="section container"><Loader /></section>;
  if (dp.error || ld.error) return <section className="section container"><ErrorNotice onRetry={() => { dp.reload(); ld.reload(); }} /></section>;

  const dept = dp.data.find((d) => d.slug === slug);
  if (!dept) return <section className="section container center-text"><h2>Ministry not found</h2><Link to="/departments" className="card__more"><LuArrowLeft aria-hidden="true" /> Back to ministries</Link></section>;

  const team = ld.data.filter((l) => l.section === slug && l.name).sort(byOrder);
  const heads = team.filter((l) => l.level === 'head');
  const others = team.filter((l) => l.level !== 'head');

  return (
    <>
      <PageBanner title={dept.name} subtitle={dept.short} />
      <section className="section">
        <div className="container container--text">
          <SectionHeading eyebrow="About this ministry" title={dept.name} />
          <p>{dept.description}</p>
          {dept.mission && <p className="ministry__mission"><b>Mission:</b> {dept.mission}</p>}
        </div>
      </section>
      {team.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <SectionHeading eyebrow="Guiding this ministry" title={heads.length > 1 ? 'Ministry Leaders' : 'Ministry Leader'} />
            <div className="grid grid--3">{heads.map((l) => <LeaderCard key={l.id} leader={l} />)}</div>
            {others.length > 0 && (
              <>
                <h3 className="leader-section__title">Team</h3>
                <div className="grid grid--3">{others.map((l) => <LeaderCard key={l.id} leader={l} />)}</div>
              </>
            )}
          </div>
        </section>
      )}
      <div className="container center-text back-row"><Link to="/departments" className="card__more"><LuArrowLeft aria-hidden="true" /> All ministries</Link></div>
    </>
  );
}
