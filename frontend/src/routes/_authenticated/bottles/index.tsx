import { createFileRoute, Link, type RouteComponent } from '@tanstack/react-router';
import {
  getUserBottlesQueryOptions,
  useUserBottlesSuspense,
} from '../../../api/generated/bottles-api';
import BottleTable from '../../../components/Tables/BottleTable';
import { buttonClasses } from '../../../components/ui/buttonClasses';

export const Route = createFileRoute('/_authenticated/bottles/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(getUserBottlesQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: bottles } = useUserBottlesSuspense();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="animate-reveal-1 mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ink">Your Collection</h1>
        <Link
          to="/bottles/new"
          className={buttonClasses({ variant: 'primary', ringOffset: 'ground' })}
        >
          + New
        </Link>
      </div>
      <BottleTable data={bottles} />
    </div>
  );
}
