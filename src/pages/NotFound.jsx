import PageBanner from '../components/PageBanner.jsx';
import Button from '../components/Button.jsx';

export default function NotFound() {
  return (
    <>
      <PageBanner title="Page not found" subtitle="The page you are looking for does not exist or has moved" />
      <section className="section center-text"><Button to="/">Back to home</Button></section>
    </>
  );
}
