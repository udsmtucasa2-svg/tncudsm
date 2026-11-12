import PageBanner from '../components/PageBanner.jsx';
import RequestForm from '../components/RequestForm.jsx';

const fields = [
  { name: 'name', label: 'Your name', required: true },
  { name: 'phone', label: 'Phone (WhatsApp if possible)', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'topic', label: 'What would you like to study?', placeholder: 'e.g. Salvation, the Sabbath, prophecy, or "anything"' },
  { name: 'preferred', label: 'Best day and time', placeholder: 'e.g. weekdays after 4pm' },
  { name: 'message', label: 'Anything else we should know?', type: 'textarea' },
];

export default function BibleStudy() {
  return (
    <>
      <PageBanner title="Request a Bible Study" subtitle="Learn the Bible with a friendly guide, at your pace" />
      <section className="section">
        <div className="container container--text">
          <p>Tell us a little about yourself and a member of our Spiritual &amp; Evangelism team will contact you to arrange a Bible study that suits you. There is no cost and no pressure.</p>
          <RequestForm type="bible-study" fields={fields} submitLabel="Request a Bible study" success="We have received your request. A member of our team will contact you soon." />
        </div>
      </section>
    </>
  );
}
