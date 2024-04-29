import { Outlet, useRouteError } from "@remix-run/react";
import ErrorBoundaryComponent from "~/library/components/ErrorBoundary/ErrorBoundaryComponent";

export default function NewReviewRoute() {
  return (
    <main>
      <h1>New Review</h1>
      <Outlet />
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryComponent error={error} />;
}
