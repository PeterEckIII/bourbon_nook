import { createFileRoute, Link } from '@tanstack/react-router';
import {
  getUserReviewsQueryOptions,
  useUserReviewsSuspense,
} from '../../../api/generated/reviews-api';
import ReviewTable from '../../../components/Tables/ReviewTable';
import { buttonClasses } from '../../../components/ui/buttonClasses';

export const Route = createFileRoute('/_authenticated/reviews/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(getUserReviewsQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: reviews } = useUserReviewsSuspense();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="animate-reveal-1 mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ink">Your Reviews</h1>
        <Link
          to="/reviews/new"
          className={buttonClasses({ variant: 'primary', ringOffset: 'ground' })}
        >
          + New
        </Link>
      </div>
      <ReviewTable data={reviews} />
    </div>
  );
}
