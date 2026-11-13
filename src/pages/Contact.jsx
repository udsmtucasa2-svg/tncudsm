import { LuMapPin, LuMail, LuAtSign } from 'react-icons/lu';
import PageBanner from '../components/PageBanner.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import RequestForm from '../components/RequestForm.jsx';
import { SocialLinks } from '../components/home/ContactSocial.jsx';
import { contact } from '../data/site.js';
import './Contact.css';

const fields = [
  { name: 'name', label: 'Your name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone (optional)', type: 'tel' },
  { name: 'topic', label: 'Subject' },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
];

export default function Contact() {
  return (
    <>
      <PageBanner title="Contact Us" subtitle="We would love to hear from you" />
      <section className="section">
        <div className="container two-col contact-page">
          <div>
            <SectionHeading eyebrow="Reach us" title="Find us" />
            <ul className="contact-list">
              <li><span className="icon-tile icon-tile--round"><LuMapPin aria-hidden="true" /></span><div><b>Where</b><span>{contact.location}</span></div></li>
              <li><span className="icon-tile icon-tile--round"><LuMail aria-hidden="true" /></span><div><b>Email</b><a href={`mailto:${contact.email}`}>{contact.email}</a></div></li>
              <li><span className="icon-tile icon-tile--round"><LuAtSign aria-hidden="true" /></span><div><b>Social media</b><span>{contact.handle}</span></div></li>
            </ul>
            <SocialLinks className="socials--dark" />
          </div>
          <div>
            <SectionHeading eyebrow="Write to us" title="Send a message" />
            <RequestForm type="message" fields={fields} submitLabel="Send message" success="Your message has been sent. We will reply as soon as we can." />
          </div>
        </div>
      </section>
    </>
  );
}
