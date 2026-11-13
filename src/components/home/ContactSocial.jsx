import { LuMapPin, LuMail, LuAtSign } from 'react-icons/lu';
import SectionHeading from '../SectionHeading.jsx';
import Reveal from '../Reveal.jsx';
import Button from '../Button.jsx';
import { contact, socials } from '../../data/site.js';
import './ContactSocial.css';

export function SocialLinks({ className = '' }) {
  return (
    <div className={`socials ${className}`.trim()}>
      {socials.map(({ name, url, Icon }) => (
        <a key={name} href={url} aria-label={name} title={name} target="_blank" rel="noreferrer"><Icon aria-hidden="true" /></a>
      ))}
    </div>
  );
}

export default function ContactSocial() {
  return (
    <section className="section section--dark contact-band wave-top">
      <div className="container">
        <SectionHeading eyebrow="Get in touch" title="Come and be part of the family" />
        <Reveal className="contact">
          <div className="contact__item"><LuMapPin aria-hidden="true" /><b>Where</b><span>{contact.location}</span></div>
          <div className="contact__item"><LuMail aria-hidden="true" /><b>Email</b><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
          <div className="contact__item"><LuAtSign aria-hidden="true" /><b>Follow</b><span>{contact.handle}</span><SocialLinks /></div>
        </Reveal>
        <div className="center-row"><Button to="/register" variant="gold">Create your account</Button></div>
      </div>
    </section>
  );
}