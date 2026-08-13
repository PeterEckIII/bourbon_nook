import { createFileRoute } from '@tanstack/react-router';
import ReviewForm from '../../../components/Forms/ReviewForm';
import { getUserBottlesQueryOptions } from '../../../api/generated/bottles-api';

export const Route = createFileRoute('/_authenticated/reviews/new')({
  loader: ({ context }) => context.queryClient.ensureQueryData(getUserBottlesQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  return <ReviewForm />;
}
