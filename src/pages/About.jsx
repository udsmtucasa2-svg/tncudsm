import PageBanner from '../components/PageBanner.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import { Icon } from '../lib/icons.jsx';
import Button from '../components/Button.jsx';
import { about, faith } from '../data/site.js';

const values = [
  { icon: 'faith', title: 'Faith', text: 'Rooted in the Word of God and the Adventist message.' },
  { icon: 'users', title: 'Fellowship', text: 'A welcoming family for every student on campus.' },
  { icon: 'service', title: 'Service', text: 'Serving our campus and community with love.' },
];

export default function About() {
  return (
    <>
      <PageBanner title="About TNC" subtitle="Seventh-day Adventist Church, Public Campus Ministries" />
      <section className="section">
        <div className="container container--text">
          <SectionHeading eyebrow="Who we are" title="TNC UDSM" />
          <p>TNC UDSM is the Seventh-day Adventist student fellowship at TUCASA Nyerere Campus, University of Dar es Salaam. We gather for worship, Bible study, music, health outreach and evangelism, and we support students spiritually through their university journey.</p>
          <p><b>Our vision.</b> {about.vision}</p>
          <p><b>Our mission.</b> {about.mission}</p>
          <p><b>What we believe.</b> {about.beliefs}</p>
        </div>
      </section>
      <section className="section section--soft" id="faith">
        <div className="container">
          <SectionHeading eyebrow="What we believe" title="Explore Our Faith" />
          <p className="lead">{about.beliefs}</p>
          <div className="grid grid--3">
            {faith.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 80}>
                <div className="card fx fx-up fx-tint"><span className="icon-tile"><Icon name={f.icon} /></span><h3>{f.title}</h3><p>{f.text}</p></div>
              </Reveal>
            ))}
          </div>
          <div className="center-row">
            <Button to="/bible-study" variant="gold" arrow>Request a Bible Study</Button>
            <Button to="/prayer-request" variant="outline">Submit a Prayer Request</Button>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="What guides us" title="Our Values" />
          <div className="grid grid--3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="card"><span className="icon-tile"><Icon name={v.icon} /></span><h3>{v.title}</h3><p>{v.text}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
