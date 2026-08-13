import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/dashboard')({
  component: RouteComponent,
});

const secondaryButtonClasses =
  'cursor-pointer rounded-md border border-ink/20 px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:ring-offset-2 focus:ring-offset-cream';

function AdminCard({
  title,
  description,
  actionLabel,
  url,
}: {
  title: string;
  description: string;
  actionLabel: string;
  url: string;
}) {
  return (
    <div className="rounded-lg border border-amber-900/15 bg-amber-600/5 p-6">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">{title}</h2>
      <p className="mt-2 text-sm text-ink/60">{description}</p>
      <Link to={url} className={`mt-4 inline-block ${secondaryButtonClasses}`}>
        {actionLabel}
      </Link>
    </div>
  );
}

function RouteComponent() {
  const { auth } = Route.useRouteContext();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Admin</p>
      <h1 className="font-caprasimo text-3xl text-ink">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <AdminCard
          title="User Management"
          description="Manage all users in the system"
          actionLabel="View Users"
          url="/admin/users"
        />
        <AdminCard
          title="System Settings"
          description="Configure system-wide settings"
          actionLabel="Open Settings"
          url="/admin/system-settings"
        />
      </div>

      <div className="mt-10 rounded-lg border border-terracotta/25 bg-terracotta/10 px-4 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/50">Your Info</h3>
        <p className="mt-1 text-sm text-ink">Username: {auth.user?.username}</p>
        <p className="mt-1 text-sm text-ink">Roles: {auth.user?.roles.join(', ')}</p>
      </div>
    </div>
  );
}
