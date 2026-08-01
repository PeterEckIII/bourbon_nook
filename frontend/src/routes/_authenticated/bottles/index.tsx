import {
  createFileRoute,
  Link,
  type RouteComponent,
} from '@tanstack/react-router';
import {
  getUserBottlesQueryOptions,
  useUserBottlesSuspense,
} from '../../../api/generated/bottles-api';

export const Route = createFileRoute('/_authenticated/bottles/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getUserBottlesQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: bottles } = useUserBottlesSuspense();

  return (
    <ul>
      {bottles.map((bottle) => (
        <li key={bottle.id}>
          <Link to="/bottles/$bottleId" params={{ bottleId: bottle.id! }}>
            {bottle.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
