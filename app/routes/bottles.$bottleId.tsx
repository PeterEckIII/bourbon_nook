import { LoaderFunctionArgs, json } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const bottleId = params.bottleId;
  if (bottleId === "1") {
    return json({ message: "The first bottle!" });
  }
  return null;
};

export default function BottleRoute() {
  return (
    <div>
      <h1>Hi</h1>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="bg-orange-500">
        <h1>Route Error Response!!</h1>
      </div>
    );
  }
  return (
    <div className="bg-red-500 h-40">
      <h1 className="text-4xl font-bold text-center">Something went wrong</h1>
    </div>
  );
}
