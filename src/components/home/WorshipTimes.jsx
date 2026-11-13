import { LuClock, LuMapPin } from 'react-icons/lu';
import Reveal from '../Reveal.jsx';
import Loader from '../Loader.jsx';
import ErrorNotice from '../ErrorNotice.jsx';
import { api } from '../../services/api.js';
import { useFetch } from '../../hooks.js';
import './WorshipTimes.css';

export default function WorshipTimes() {
  const { data, loading, error, reload } = useFetch(api.getServices);
  return (
    <section className="worship" id="worship">
      <div className="container">
        {loading ? <Loader /> : error ? <ErrorNotice onRetry={reload} /> : (
          <div className="worship__grid">
            {data.map((s, i) => (
              <Reveal key={s.id} delay={i * 80} className="card card--small card--service fx fx-split fx-teal">
                <span className="badge">{s.day}</span>
                <h3>{s.name}</h3>
                <p><LuClock aria-hidden="true" />{s.time}</p>
                <p><LuMapPin aria-hidden="true" />{s.place}</p>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
