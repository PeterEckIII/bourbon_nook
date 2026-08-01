import { createFileRoute } from '@tanstack/react-router';
import {
  getUserBottleQueryOptions,
  useUserBottleSuspense,
} from '../../../api/generated/bottles-api';

export const Route = createFileRoute('/_authenticated/bottles/$bottleId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      getUserBottleQueryOptions(params.bottleId),
    ),
  component: RouteComponent,
});

function RouteComponent() {
  const { bottleId } = Route.useParams();
  const { data: bottle } = useUserBottleSuspense(bottleId);
  return (
    <div>
      <h1>Bottle</h1>
      <p>{bottle.name}</p>
    </div>
  );
}
