import { createFileRoute } from '@tanstack/react-router';
import {
  getReviewQueryOptions,
  getCategoriesWithSystemNotesQueryOptions,
  useReviewSuspense,
} from '../../../api/generated/reviews-api';
import ReviewForm from '../../../components/Forms/ReviewForm';

export const Route = createFileRoute('/_authenticated/reviews/$reviewId_/edit')({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(getReviewQueryOptions(params.reviewId)),
      context.queryClient.ensureQueryData(getCategoriesWithSystemNotesQueryOptions()),
    ]);
  },
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
