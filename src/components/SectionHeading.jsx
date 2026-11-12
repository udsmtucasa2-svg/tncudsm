export default function SectionHeading({ eyebrow, title }) {
  return (
    <div className="heading">
      {eyebrow && <div className="heading__eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
    </div>
  );
}
