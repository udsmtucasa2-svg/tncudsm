import { useState } from 'react';
import Button from '../Button.jsx';
import SectionHeading from '../SectionHeading.jsx';
import Reveal from '../Reveal.jsx';
import { Icon } from '../../lib/icons.jsx';
import { about } from '../../data/site.js';

const tabs = [
  { key: 'vision', label: 'Vision', icon: 'vision' },
  { key: 'mission', label: 'Mission', icon: 'mission' },
  { key: 'beliefs', label: 'Beliefs', icon: 'evangelism' },
];

export default function AboutTabs() {
  const [active, setActive] = useState('vision');
  const current = tabs.find((t) => t.key === active);
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="About us" title="One family in Christ" />
        <Reveal className="about-tabs">
          <div className="tabs" role="tablist">
            {tabs.map((t) => (
              <button key={t.key} role="tab" aria-selected={active === t.key} className={`tab ${active === t.key ? 'active' : ''}`} onClick={() => setActive(t.key)}>{t.label}</button>
            ))}
          </div>
          <div className="about-card" role="tabpanel" key={active}>
            <span className="about-card__icon"><Icon name={current.icon} /></span>
            <h3>Our {current.label}</h3>
            <p>{about[active]}</p>
            <Button to={active === 'beliefs' ? '/about#faith' : '/about'} variant="gold" arrow>{active === 'beliefs' ? 'Explore Our Faith' : 'Read more about us'}</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
