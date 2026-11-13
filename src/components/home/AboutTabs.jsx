import { useState } from 'react';
import Button from '../Button.jsx';
import SectionHeading from '../SectionHeading.jsx';
import Reveal from '../Reveal.jsx';
import BlobCard, { BlobGrid } from '../Blobcard.jsx';
import { Icon } from '../../lib/icons.jsx';
import { about } from '../../data/site.js';
import { beliefGroups } from '../../data/beliefs.js';
import './AboutTabs.css';

const tabs = [
  { key: 'vision', label: 'Vision', icon: 'vision' },
  { key: 'mission', label: 'Mission', icon: 'mission' },
  { key: 'beliefs', label: 'Beliefs', icon: 'evangelism' },
];
const tones = ['teal', 'gold', 'navy'];

export default function AboutTabs({ tone = '' }) {
  const [active, setActive] = useState('vision');
  const current = tabs.find((t) => t.key === active);
  const total = beliefGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className={`section ${tone}`}>
      <div className="container">
        <SectionHeading eyebrow="About us" title="One family in Christ" />
        <div className="tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t.key} role="tab" aria-selected={active === t.key} className={`tab ${active === t.key ? 'active' : ''}`} onClick={() => setActive(t.key)}>{t.label}</button>
          ))}
        </div>

        <div role="tabpanel" key={active} className="about-panel">
          {active === 'beliefs' ? (
            <>
              <p className="lead">{about.beliefs} Our {total} Fundamental Beliefs, in {beliefGroups.length} groups:</p>
              <BlobGrid>
                {beliefGroups.map((g, i) => (
                  <Reveal key={g.key} delay={(i % 3) * 80}>
                    <BlobCard icon={g.icon} tone={tones[i % 3]} title={g.title} text={g.items.map(([name]) => name).join(', ')}>
                      <span className="about-count">{g.items.length} {g.items.length === 1 ? 'belief' : 'beliefs'}</span>
                    </BlobCard>
                  </Reveal>
                ))}
              </BlobGrid>
            </>
          ) : (
            <div className="about-feature">
              <span className="about-feature__blob" aria-hidden="true">
                <span><Icon name={current.icon} /></span>
              </span>
              <div className="about-feature__text">
                <div className="about-feature__eyebrow">Our {current.label}</div>
                <p>{about[active]}</p>
              </div>
            </div>
          )}
          <div className="center-row">
            <Button to={active === 'beliefs' ? '/about#faith' : '/about'} variant="gold" arrow>
              {active === 'beliefs' ? 'Explore Our Faith' : 'Read more about us'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}