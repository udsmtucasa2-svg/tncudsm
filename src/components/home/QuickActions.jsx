import { Link } from 'react-router-dom';
import { LuBookOpen, LuHeartHandshake, LuCalendarDays, LuLogIn, LuUser, LuArrowRight } from 'react-icons/lu';
import SectionHeading from '../SectionHeading.jsx';
import Reveal from '../Reveal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// The four most useful next steps for a visitor, as large cards.
export default function QuickActions() {
  const { user, isAdmin } = useAuth();
  const actions = [
    { to: '/bible-study', Icon: LuBookOpen, title: 'Request a Bible Study', text: 'Learn the Bible with a friendly study guide.', fx: 'fx-skew fx-teal' },
    { to: '/prayer-request', Icon: LuHeartHandshake, title: 'Submit a Prayer Request', text: 'Share a need and our team will pray with you.', fx: 'fx-up fx-tint' },
    { to: '/events', Icon: LuCalendarDays, title: 'Upcoming Events', text: 'See what is happening on campus next.', fx: 'fx-side fx-tint' },
    user
      ? { to: isAdmin ? '/admin' : '/dashboard', Icon: LuUser, title: 'My Profile', text: 'Open your profile and family.', fx: 'fx-split fx-navy' }
      : { to: '/login', Icon: LuLogIn, title: 'Member Login', text: 'Sign in to see your profile and family.', fx: 'fx-split fx-navy' },
  ];
  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading eyebrow="Get involved" title="How can we help you today?" />
        <div className="qa">
          {actions.map(({ to, Icon, title, text, fx }, i) => (
            <Reveal key={title} delay={i * 70}>
              <Link to={to} className={`card qa__card fx ${fx}`}>
                <span className="icon-tile"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="card__more">Go <LuArrowRight aria-hidden="true" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
