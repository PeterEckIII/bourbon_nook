import { createFileRoute } from '@tanstack/react-router';
import {
  getUserBottlesQueryOptions,
  useUserBottlesSuspense,
} from '../../api/generated/bottles-api';
import {
  getUserReviewsQueryOptions,
  useUserReviewsSuspense,
} from '../../api/generated/reviews-api';
import ReviewTable from '../../components/Tables/ReviewTable';
import BottleTable from '../../components/Tables/BottleTable';

export const Route = createFileRoute('/_authenticated/')({
  loader: ({ context }) => {
    return (
      context.queryClient.ensureQueryData(getUserBottlesQueryOptions()),
      context.queryClient.ensureQueryData(getUserReviewsQueryOptions())
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: bottles } = useUserBottlesSuspense();
  const { data: reviews } = useUserReviewsSuspense();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ink">Home</h1>
      </div>
      <h2 className="mb-3 text-xs font-semibold tracking-wide text-ink/50 uppercase">Collection</h2>
      <BottleTable data={bottles} className="max-h-96 overflow-y-auto" />
      <h2 className="mt-10 mb-3 text-xs font-semibold tracking-wide text-ink/50 uppercase">
        Reviews
      </h2>
      <ReviewTable data={reviews} className="max-h-96 overflow-y-auto" />
    </div>
  );
}
