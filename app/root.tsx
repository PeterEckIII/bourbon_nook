import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  // useLoaderData,
  useRouteError,
} from "@remix-run/react";
import "./tailwind.css?inline";
import { prisma } from "./.server/libs/prisma";
import { json } from "@remix-run/node";
import Button from "./library/components/Button/Button";

type TempUser = {
  name: string;
  role: "ADMIN" | "USER";
};

// const isTempUser = (value: unknown): value is TempUser => {
//   if (typeof value !== "object" || value === null) return false;
//   if ("name" in value && typeof value.name !== "string") return false;
//   if ("role" in value && typeof value.role !== "string") return false;
//   return true;
// };

export async function loader() {
  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Form method="POST" action="/logout">
          <Button
            primary={false}
            label="Logout"
            type="submit"
            onClick={() => console.log(`Logging out...`)}
          />
        </Form>
        {children}
        <ScrollRestoration />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Layout>
      <Outlet />
      <Scripts />
    </Layout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  // catch boundary (handles thrown responses)
  if (isRouteErrorResponse(error)) {
    return (
      <Layout>
        {" "}
        <div className="bg-orange-500">
          <h1 className="text-white text-2xl font-bold">
            {error.status} Error!
          </h1>
          <pre>{error.data.message}</pre>
        </div>
      </Layout>
    );
  }
  // if we make it here, there is an error (thrown error)
  if (error instanceof Error) {
    return <Layout>{error.message}</Layout>;
  }
  return (
    <Layout>
      <div className="bg-red-500">
        <h1 className="text-white text-2xl font-bold">Unknown Error!</h1>
        <pre>{JSON.stringify(error)}</pre>
      </div>
    </Layout>
  );
}
