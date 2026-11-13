import './PageBanner.css';
// Same banner on every page, so the site stays consistent.
export default function PageBanner({ title, subtitle }) {
  return (
    <section className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
