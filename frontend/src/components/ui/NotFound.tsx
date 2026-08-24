import { Link } from '@tanstack/react-router';
import { buttonClasses } from './buttonClasses';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="animate-reveal-1 text-xs font-semibold uppercase tracking-wide text-ink/50">
        404
      </p>
      <h1 className="animate-reveal-1 font-caprasimo text-3xl text-ink">This barrel's empty</h1>
      <p className="animate-reveal-2 mt-3 max-w-sm text-sm text-ink/60">
        We couldn't find the page you were looking for. It may have moved, or never existed.
      </p>
      <Link
        to="/"
        className={`animate-reveal-2 mt-6 ${buttonClasses({ variant: 'primary', ringOffset: 'ground' })}`}
      >
        Back to Home
      </Link>
    </div>
  );
}
