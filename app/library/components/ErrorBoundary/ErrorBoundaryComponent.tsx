import { isRouteErrorResponse } from "@remix-run/react";

export default function ErrorBoundaryComponent({ error }: { error: unknown }) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>There was an error</h1>
        <pre>{error.data}</pre>
        <pre>Threw response code {error.status}</pre>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>There was an error</h1>
        <pre>{error.message}</pre>
        <pre>Stacktrace {error.stack?.toString()} </pre>
      </div>
    );
  } else {
    return (
      <div>
        <h1>
          Unknown error! You shouldn&apos;t be here. Press back on your browser
          or load the homepage in your browser
        </h1>
        <pre>ERROR: {JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }
}
