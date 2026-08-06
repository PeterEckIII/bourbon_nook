import { createFileRoute, Link } from '@tanstack/react-router';
import {
  getUserReviewsQueryOptions,
  useUserReviewsSuspense,
} from '../../../api/generated/reviews-api';
import ReviewTable from '../../../components/Tables/ReviewTable';

export const Route = createFileRoute('/_authenticated/reviews/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getUserReviewsQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: reviews } = useUserReviewsSuspense();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ink">Your Reviews</h1>
        <Link
          to="/reviews/new"
          className="cursor-pointer rounded-md border border-amber-500/40 bg-amber-600 px-4 py-2 text-sm font-medium tracking-wide text-amber-50 transition-colors duration-150 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:ring-offset-2 focus:ring-offset-ground"
        >
          + New
        </Link>
      </div>
      <ReviewTable data={reviews} />
    </div>
  );
}
