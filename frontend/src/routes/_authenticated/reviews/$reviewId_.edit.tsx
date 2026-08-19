import { createFileRoute } from '@tanstack/react-router';
import { getReviewQueryOptions, useReviewSuspense } from '../../../api/generated/reviews-api';
import ReviewForm from '../../../components/Forms/ReviewForm';

export const Route = createFileRoute('/_authenticated/reviews/$reviewId_/edit')({
  loader: async ({ context, params }) =>
    await context.queryClient.ensureQueryData(getReviewQueryOptions(params.reviewId)),
  component: RouteComponent,
});

function RouteComponent() {
  const { reviewId } = Route.useParams();
  const { data: review } = useReviewSuspense(reviewId);
  return (
    <>
      <ReviewForm valuesToEdit={review} reviewId={reviewId} />
    </>
  );
}
