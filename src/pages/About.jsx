import { useMemo, useState } from 'react';
import { LuLandmark, LuUsers, LuBookOpen } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';
import BlobCard, { BlobGrid } from '../components/Blobcard.jsx';
import { beliefImageCandidates } from '../data/beliefImages.js';
import { about } from '../data/site.js';
import { beliefGroups } from '../data/beliefs.js';
import './About.css';

const values = [
  { icon: 'faith', title: 'Faith', text: 'Rooted in the Word of God and the Adventist message.' },
  { icon: 'users', title: 'Fellowship', text: 'A welcoming family for every student on campus.' },
  { icon: 'service', title: 'Service', text: 'Serving our campus and community with love.' },
];

const tones = ['teal', 'gold', 'navy'];

// Section tones alternate white / light grey down the page.
export default function About() {
  // Flatten the groups into one numbered list (1 to 28), remembering each belief's group for the filter and colour.
  const all = useMemo(() => {
    let num = 0;
    return beliefGroups.flatMap((g, gi) => g.items.map(([name, text]) => {
      num += 1;
      return { num, name, text, image: beliefImageCandidates(num), group: g.key, icon: g.icon, tone: tones[gi % 3] };
    }));
  }, []);
  const total = all.length;
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? all : all.filter((b) => b.group === filter);

  let n = 0;
  const tone = () => (n++ % 2 ? 'section--soft' : '');

  return (
    <>
      <PageBanner title="About TNC" subtitle="Seventh-day Adventist Church, Public Campus Ministries" />

      {/* 1. Who we are */}
      <section className={`section ${tone()}`}>
        <div className="container container--text">
          <SectionHeading eyebrow="Who we are" title="TNC UDSM" />
          <p>TNC UDSM is the Seventh-day Adventist student fellowship at TUCASA Nyerere Campus, University of Dar es Salaam. We gather for worship, Bible study, music, health outreach and evangelism, and we support students spiritually through their university journey.</p>
          <ul className="about-facts">
            <li><LuLandmark aria-hidden="true" />Seventh-day Adventist Church</li>
            <li><LuUsers aria-hidden="true" />Public Campus Ministries</li>
            <li><LuBookOpen aria-hidden="true" />TUCASA Nyerere Campus</li>
          </ul>
        </div>
      </section>

      {/* 2. Mission and vision, then values: blob cards, three across (stacked rows on phones) */}
      <section className={`section ${tone()}`}>
        <div className="container">
          <SectionHeading eyebrow="Why we exist" title="Our Mission, Vision and Values" />
          <BlobGrid>
            <Reveal><BlobCard icon="mission" tone="teal" title="Our Mission" text={about.mission} /></Reveal>
            <Reveal delay={80}><BlobCard icon="vision" tone="gold" title="Our Vision" text={about.vision} /></Reveal>
            <Reveal delay={160}><BlobCard icon="users" tone="navy" title="Our Values" text="Faith, Fellowship and Service guide everything we do." /></Reveal>
          </BlobGrid>
          <h3 className="about-sub">What we value</h3>
          <BlobGrid>
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}><BlobCard icon={v.icon} tone={tones[i]} title={v.title} text={v.text} /></Reveal>
            ))}
          </BlobGrid>
        </div>
      </section>

      {/* 3. What we believe: the 28 Fundamental Beliefs (kept at #faith for the Explore Our Faith buttons) */}
      <section className={`section ${tone()}`} id="faith">
        <div className="container">
          <SectionHeading eyebrow="What we believe" title="Explore Our Faith" />
          <p className="lead">{about.beliefs} Our {total} Fundamental Beliefs come from the Bible. Pick a group to focus on it.</p>
          <div className="tabs" role="tablist" aria-label="Belief groups">
            <button role="tab" aria-selected={filter === 'all'} className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All {total}</button>
            {beliefGroups.map((g) => (
              <button key={g.key} role="tab" aria-selected={filter === g.key} className={`tab ${filter === g.key ? 'active' : ''}`} onClick={() => setFilter(g.key)}>{g.title}</button>
            ))}
          </div>
          <BlobGrid className="beliefs-grid" key={filter}>
            {shown.map((b, i) => (
              <Reveal key={b.num} delay={(i % 3) * 80}>
                <BlobCard icon={b.icon} image={b.image} tone={b.tone} badge={b.num} title={b.name} text={b.text} />
              </Reveal>
            ))}
          </BlobGrid>
          <p className="beliefs__source">Full statements: <a href="https://www.adventist.org/beliefs/" target="_blank" rel="noreferrer">adventist.org/beliefs</a></p>
          <div className="center-row">
            <Button to="/bible-study" variant="gold" arrow>Request a Bible Study</Button>
            <Button to="/prayer-request" variant="outline">Submit a Prayer Request</Button>
          </div>
        </div>
      </section>

      {/* 4. Invitation */}
      <section className="about-cta">
        <div className="container about-cta__inner">
          <div><h2>You are welcome here</h2><p>Come to worship this Sabbath, or join the family online.</p></div>
          <div className="about-cta__actions">
            <Button to="/register" variant="gold" arrow>Join TNC</Button>
            <Button to="/contact" variant="light">Contact us</Button>
          </div>
        </div>
      </section>
    </>
  );
}