import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight, LuLandmark, LuUsers, LuBookOpen } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';
import BlobCard, { BlobGrid } from '../components/BlobCard.jsx';
import { beliefImageCandidates } from '../data/beliefImages.js';
import { Icon } from '../lib/icons.jsx';
import { about } from '../data/site.js';
import { beliefGroups, story, structure } from '../data/beliefs.js';
import './About.css';

const values = [
  { icon: 'faith', title: 'Faith', text: 'Rooted in the Word of God and the Adventist message.' },
  { icon: 'users', title: 'Fellowship', text: 'A welcoming family for every student on campus.' },
  { icon: 'service', title: 'Service', text: 'Serving our campus and community with love.' },
];

const tones = ['teal', 'gold', 'navy'];

const doing = [
  { icon: 'church', title: 'Worship', text: 'Sabbath School and Divine Service every Sabbath.', to: '/#worship' },
  { icon: 'evangelism', title: 'Bible study', text: 'Study the Bible with a friendly guide.', to: '/bible-study' },
  { icon: 'music', title: 'Music', text: 'Join the choir and praise teams.', to: '/choir' },
  { icon: 'medical', title: 'Health and service', text: 'Care for body, mind and community.', to: '/departments' },
];

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

      {/* 4. Our story */}
      <section className={`section ${tone()}`}>
        <div className="container container--narrow">
          <SectionHeading eyebrow="Our story" title="From a Bible study movement to a worldwide family" />
          <ol className="timeline">
            {story.map((s) => (
              <li key={s.year} className="timeline__item">
                <span className="timeline__year">{s.year}</span>
                <div><h3>{s.title}</h3><p>{s.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. How the church is organised (a simple stepper, no cards) */}
      <section className={`section ${tone()}`}>
        <div className="container">
          <SectionHeading eyebrow="One worldwide church" title="How the Church Is Organised" />
          <p className="lead">TNC is part of a global family. Every level works together for the same mission.</p>
          <ol className="structure">
            {structure.map(([name, text], i) => (
              <li key={name} className={i === 0 ? 'is-here' : ''}>
                <span className="structure__dot">{i + 1}</span>
                <b>{name}</b>
                <span className="structure__text">{text}</span>
                {i === 0 && <em>TNC UDSM is here</em>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. What we do (icon list, no cards) */}
      <section className={`section ${tone()}`}>
        <div className="container">
          <SectionHeading eyebrow="Get involved" title="What We Do" />
          <ul className="doing">
            {doing.map((d) => (
              <li key={d.title}>
                <Link to={d.to} className="doing__item">
                  <span className="doing__icon"><Icon name={d.icon} /></span>
                  <span className="doing__body"><b>{d.title}</b><span>{d.text}</span></span>
                  <LuArrowRight className="doing__go" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. Invitation */}
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