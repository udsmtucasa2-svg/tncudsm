import Button from './Button.jsx';

// Inline message for a failed data request, with a retry button.
export default function ErrorNotice({ onRetry, children = 'We could not load this content right now.' }) {
  return (
    <div className="notice" role="alert">
      <p>{children}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}
