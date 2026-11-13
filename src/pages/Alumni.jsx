import { LuGraduationCap, LuUsers, LuHeartHandshake } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';

const points = [
  { Icon: LuUsers, title: 'Stay connected', text: 'Once a TNC member, always part of the family. Register as an alumnus and keep in touch with the fellowship.' },
  { Icon: LuGraduationCap, title: 'Mentor students', text: 'Share your study and work experience with students who are walking the road you walked.' },
  { Icon: LuHeartHandshake, title: 'Support the mission', text: 'Pray, volunteer, speak or give towards the ministry that shaped you.' },
];

export default function Alumni() {
  return (
    <>
      <PageBanner title="Alumni" subtitle="Graduated, but never gone" />
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Welcome back" title="Our alumni family" />
          <p className="lead">When members complete their studies they move into our alumni family automatically. We would love to hear where God has led you.</p>
          <div className="grid grid--3">
            {points.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80}>
                <article className="card card--tile fx fx-skew fx-teal">
                  <span className="icon-tile"><Icon aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="center-row">
            <Button to="/register" variant="gold" arrow>Register as an alumnus</Button>
            <Button to="/login" variant="outline">Member login</Button>
          </div>
        </div>
      </section>
    </>
  );
}
