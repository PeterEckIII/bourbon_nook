import { createFileRoute, Link } from '@tanstack/react-router';
import { getGetUsersQueryOptions, useGetUsersSuspense } from '../../../../api/generated/users-api';
import UserTable from '../../../../components/Tables/UserTable';

export const Route = createFileRoute('/_authenticated/admin/users/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getGetUsersQueryOptions({ query: { staleTime: 15_000 } })),
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useGetUsersSuspense();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/admin/dashboard"
        className="text-sm text-ink/60 transition-colors duration-150 hover:text-ink"
      >
        ← Back to Admin Dashboard
      </Link>
      <h1 className="animate-reveal-1 mt-4 mb-6 text-2xl font-semibold text-ink">Users</h1>
      <UserTable data={data} />
    </div>
  );
}
