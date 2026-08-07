import { createFileRoute, Link } from '@tanstack/react-router';
import {
  getFollowersQueryOptions,
  getFollowingQueryOptions,
  getMeQueryOptions,
  useFollowersSuspense,
  useFollowingSuspense,
  useMeSuspense,
} from '../../../api/generated/users-api';
import {
  getCountBottlesQueryOptions,
  useCountBottlesSuspense,
} from '../../../api/generated/bottles-api';
import {
  getCountReviewsQueryOptions,
  useCountReviewsSuspense,
} from '../../../api/generated/reviews-api';

export const Route = createFileRoute('/_authenticated/profile/')({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(getMeQueryOptions());
    context.queryClient.ensureQueryData(getCountBottlesQueryOptions());
    context.queryClient.ensureQueryData(getCountReviewsQueryOptions());
    const userId = context.auth.user?.id || '';
    context.queryClient.ensureQueryData(
      getFollowersQueryOptions(userId, {
        pageable: {
          page: 1,
          size: 50,
        },
      }),
    );
    context.queryClient.ensureQueryData(
      getFollowingQueryOptions(userId, {
        pageable: {
          page: 1,
          size: 50,
        },
      }),
    );
    return { userId };
  },
  component: RouteComponent,
});

const secondaryButtonClasses =
  'cursor-pointer rounded-md border border-ink/20 px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:ring-offset-2 focus:ring-offset-cream';

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-terracotta/25 bg-terracotta/10 px-4 py-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold text-pour">{value}</dd>
    </div>
  );
}

function UserList({
  users,
  emptyLabel,
}: {
  users: { userId?: string; username?: string }[];
  emptyLabel: string;
}) {
  if (users.length === 0) {
    return (
      <p className="mt-3 rounded-lg border border-amber-900/15 bg-amber-600/5 px-4 py-8 text-center text-sm text-ink/60">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="mt-3 divide-y divide-amber-900/10 rounded-lg border border-amber-900/15 bg-amber-600/5">
      {users.map((user) => (
        <li key={user.userId} className="px-4 py-3 text-sm text-ink">
          {user.username}
        </li>
      ))}
    </ul>
  );
}

function RouteComponent() {
  const { userId } = Route.useLoaderData();
  const { data: user } = useMeSuspense();
  const { data: bottleCount } = useCountBottlesSuspense();
  const { data: reviewCount } = useCountReviewsSuspense();
  const { data: followers } = useFollowersSuspense(userId, {
    pageable: {
      page: 1,
      size: 50,
    },
  });
  const { data: following } = useFollowingSuspense(userId, {
    pageable: {
      page: 1,
      size: 50,
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="text-sm text-ink/60 transition-colors duration-150 hover:text-ink"
      >
        ← Back to Home
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Profile
          </p>
          <h1 className="font-caprasimo text-3xl text-ink">
            {user.username}
          </h1>
          <p className="mt-1 text-sm text-ink/60">{user.email}</p>
        </div>
        <div className="flex gap-3">
          <button type="button" className={secondaryButtonClasses}>
            Change username
          </button>
          <button type="button" className={secondaryButtonClasses}>
            Change password
          </button>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Bottles" value={bottleCount} />
        <Stat label="Reviews" value={reviewCount} />
        <Stat label="Followers" value={followers.totalElements ?? 0} />
        <Stat label="Following" value={following.totalElements ?? 0} />
      </dl>

      <div className="mt-10 grid grid-cols-1 gap-8 border-t border-ink/10 pt-8 sm:grid-cols-2">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Followers
          </h2>
          <UserList
            users={followers.content ?? []}
            emptyLabel="No followers yet."
          />
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Following
          </h2>
          <UserList
            users={following.content ?? []}
            emptyLabel="Not following anyone yet."
          />
        </section>
      </div>
    </div>
  );
}
