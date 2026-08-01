import { createFileRoute } from '@tanstack/react-router';
import {
  getUserReviewsQueryOptions,
  useUserReviewsSuspense,
} from '../../../api/generated/reviews-api';

export const Route = createFileRoute('/_authenticated/reviews/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getUserReviewsQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: reviews } = useUserReviewsSuspense();
  return (
    <ul>
      {reviews.map((review) => (
        <li key={review.id}>{review.thoughts}</li>
      ))}
    </ul>
  );
}
