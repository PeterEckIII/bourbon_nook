import { createFileRoute } from '@tanstack/react-router';
import {
  getUserBottleQueryOptions,
  useUserBottleSuspense,
} from '../../../api/generated/bottles-api';
import BottleForm from '../../../components/Forms/BottleForm';

export const Route = createFileRoute('/_authenticated/bottles/$bottleId_/edit')(
  {
    loader: ({ context, params }) =>
      context.queryClient.ensureQueryData(
        getUserBottleQueryOptions(params.bottleId),
      ),
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { bottleId } = Route.useParams();
  const { data: bottle } = useUserBottleSuspense(bottleId);
  return (
    <>
      <BottleForm valuesToEdit={bottle} bottleId={bottleId} />
    </>
  );
}
