import PageBanner from '../components/PageBanner.jsx';
import RequestForm from '../components/RequestForm.jsx';

const fields = [
  { name: 'name', label: 'Your name (optional)', hint: 'Leave empty to stay anonymous.' },
  { name: 'message', label: 'Your prayer request', type: 'textarea', required: true, placeholder: 'Share as much or as little as you wish.' },
  { name: 'email', label: 'Email (optional)', type: 'email', hint: 'Only if you would like a reply.' },
  { name: 'share', label: 'My request may be shared with the prayer team', type: 'checkbox' },
];

export default function PrayerRequest() {
  return (
    <>
      <PageBanner title="Submit a Prayer Request" subtitle="You do not have to carry it alone" />
      <section className="section">
        <div className="container container--text">
          <p>Whatever you are facing, studies, family, health or faith, we would be glad to pray with you. Your request is seen only by those who pray, and you may stay anonymous.</p>
          <RequestForm type="prayer" fields={fields} submitLabel="Send my request" success="Your request has been received. We are praying with you." />
        </div>
      </section>
    </>
  );
}
