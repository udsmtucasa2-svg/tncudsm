import { LuInbox } from 'react-icons/lu';

// Friendly message when a list has nothing yet (instead of fake placeholder content).
export default function EmptyState({ icon: Icon = LuInbox, title, children }) {
  return (
    <div className="empty">
      <span className="empty__icon"><Icon aria-hidden="true" /></span>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}
