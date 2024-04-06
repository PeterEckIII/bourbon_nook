import { useEffect } from "react";
import {
  useFetcher,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

export default function BottleRoute() {
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.submit(
      "https://res.cloudinary.com/jpeckiii/image/upload/v1/common/EHT_zpzfun"
    );
  }, [fetcher]);
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
