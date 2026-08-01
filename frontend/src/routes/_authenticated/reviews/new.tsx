import { createFileRoute } from '@tanstack/react-router';
import ReviewForm from '../../../components/Forms/ReviewForm';

export const Route = createFileRoute('/_authenticated/reviews/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReviewForm />;
}
