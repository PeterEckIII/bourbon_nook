import { Link } from '@tanstack/react-router';
import type { ReviewResponseModel } from '../../api/generated/reviews-api';
import useReviewTable from '../../hooks/useReviewTable';
import TBody from './shared/TBody';
import THead from './shared/THead';

export default function ReviewTable({
  data,
  className = '',
}: {
  data: ReviewResponseModel[];
  className?: string;
}) {
  const { table } = useReviewTable({ data });

  if (data.length === 0) {
    return (
      <div className="animate-reveal-2 rounded-lg border border-amber-900/15 bg-cream px-4 py-12 text-center text-sm text-ink/60">
        No reviews yet.
        <Link to="/reviews/new">Add one</Link>
      </div>
    );
  }

  return (
    <div
      className={`animate-reveal-2 overflow-x-auto rounded-lg border border-amber-900/15 bg-cream ${className}`}
    >
      <table className="w-full min-w-max border-collapse text-left">
        <THead table={table} />
        <TBody table={table} />
      </table>
    </div>
  );
}
