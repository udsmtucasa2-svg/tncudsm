import { Link } from 'react-router-dom';
import { LuMapPin, LuMail } from 'react-icons/lu';
import { sections } from '../data/leadershipStructure.js';
import { contact } from '../data/site.js';
import { SocialLinks } from './home/ContactSocial.jsx';
import { BrandLogos } from './Navbar.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <BrandLogos size="lg" tone="white" />
          <p className="footer__about">Seventh-day Adventist Church, Public Campus Ministries. TUCASA Nyerere Campus (TNC), University of Dar es Salaam.</p>
          <SocialLinks />
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/about">About TNC</Link></li>
            <li><Link to="/leadership">Leadership</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/choir">TNC Choir</Link></li>
            <li><Link to="/families">Family & Prayer Groups</Link></li>
            <li><Link to="/gallery">Memories & Gallery</Link></li>
            <li><Link to="/library">TNC Library</Link></li>
            <li><Link to="/news">News & Announcements</Link></li>
            <li><Link to="/sports">Sports & Recreation</Link></li>
            <li><Link to="/alumni">Alumni</Link></li>
          </ul>
        </div>
        <div>
          <h4>Ministries</h4>
          <ul>{sections.filter((x) => x.key !== 'executive').map((x) => <li key={x.key}><Link to={`/departments/${x.key}`}>{x.label}</Link></li>)}</ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="footer__contact">
            <li><LuMapPin aria-hidden="true" /><span>{contact.location}</span></li>
            <li><LuMail aria-hidden="true" /><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/bible-study">Request a Bible Study</Link></li>
            <li><Link to="/prayer-request">Submit a Prayer Request</Link></li>
            <li><Link to="/login">Member Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer__bar">© {new Date().getFullYear()} TUCASA Nyerere Campus 
        - UDSM, All rights reserved.</div>
    </footer>
  );
}
