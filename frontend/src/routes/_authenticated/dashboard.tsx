import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  return (
    <div className="">
      <p>Hello {auth?.user?.username}</p>
    </div>
  );
}
