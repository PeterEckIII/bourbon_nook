import { Outlet, useRouteError } from "@remix-run/react";
import ErrorBoundaryComponent from "~/library/components/ErrorBoundary/ErrorBoundaryComponent";

export default function RootReviewRoute() {
  return (
    <main>
      <h1>Reviews</h1>
      <Outlet />
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryComponent error={error} />;
}
