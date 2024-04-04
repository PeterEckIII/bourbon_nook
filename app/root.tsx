import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css?inline";
import { prisma } from ".server/db";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await prisma.user.findFirst();
  console.log(`User: ${JSON.stringify(user)}`);
  return json({ user });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {user ? (
          <h1>Welcome back {user.username}</h1>
        ) : (
          <h1>Welcome, please sign in!</h1>
        )}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
