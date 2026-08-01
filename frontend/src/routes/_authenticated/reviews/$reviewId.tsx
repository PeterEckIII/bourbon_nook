import { createFileRoute } from '@tanstack/react-router';
import {
  getReviewQueryOptions,
  useReviewSuspense,
} from '../../../api/generated/reviews-api';

export const Route = createFileRoute('/_authenticated/reviews/$reviewId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getReviewQueryOptions(params.reviewId)),
  component: RouteComponent,
});

function RouteComponent() {
  const { reviewId } = Route.useParams();
  const { data: review } = useReviewSuspense(reviewId);

  return (
    <div>
      <h1>Review</h1>
      <p>{review.thoughts}</p>
    </div>
  );
}
