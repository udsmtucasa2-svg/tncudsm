import { Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';

// One button style across the whole site.
// variant: 'primary' (teal, default) | 'gold' | 'outline' | 'light' (for dark backgrounds)
// arrow: show a trailing arrow icon.
export default function Button({ to, href, variant = 'primary', arrow, block, className = '', children, ...rest }) {
  const cls = ['btn', `btn--${variant}`, block && 'btn--block', className].filter(Boolean).join(' ');
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <LuArrowRight className="btn__icon" aria-hidden="true" />}
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} target="_blank" rel="noreferrer" {...rest}>{inner}</a>;
  return <button type="button" className={cls} {...rest}>{inner}</button>;
}
