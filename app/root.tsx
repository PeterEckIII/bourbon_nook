import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  // useLoaderData,
  useRouteError,
} from "@remix-run/react";
import "./tailwind.css?inline";
import Button from "./library/components/Button/Button";
import { themeSessionResolver } from "./.server/utils/theme.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import ModeToggle from "./library/components/ModeToggle/ModeToggle";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);

  return {
    theme: getTheme(),
  };
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <ModeToggle />
        <Form method="POST" action="/logout">
          <Button
            primary={false}
            label="Logout"
            type="submit"
            onClick={() => console.log(`Logging out...`)}
          />
        </Form>
        <Outlet />
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/api/set-theme">
      <App />
    </ThemeProvider>
  );
}

function ErrorHTMLStructure({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  // catch boundary (handles thrown responses)
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorHTMLStructure>
        <div className="bg-orange-500">
          <h1 className="text-white text-2xl font-bold">
            {error.status} Error!
          </h1>
          <pre>{error.data.message}</pre>
        </div>
      </ErrorHTMLStructure>
    );
  }
  // if we make it here, there is an error (thrown error)
  if (error instanceof Error) {
    return (
      <ErrorHTMLStructure>
        <div className="bg-red-500">
          <h1 className="text-white text-2xl font-bold">Unknown Error!</h1>
          <pre>{error.message}</pre>
        </div>
      </ErrorHTMLStructure>
    );
  }
  return (
    <ErrorHTMLStructure>
      <div className="bg-red-500">
        <h1 className="text-white text-2xl font-bold">Unknown Error!</h1>
        <pre>{JSON.stringify(error)}</pre>
      </div>
    </ErrorHTMLStructure>
  );
}

// export function Layout({ children }: { children: React.ReactNode }) {
//   const data = useLoaderData<typeof loader>();
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <Meta />
//         <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
//         <Links />
//       </head>
//       <body>
//         <ModeToggle />
//         <Form method="POST" action="/logout">
//           <Button
//             primary={false}
//             label="Logout"
//             type="submit"
//             onClick={() => console.log(`Logging out...`)}
//           />
//         </Form>
//         {children}
//         <ScrollRestoration />
//       </body>
//     </html>
//   );
// }

// export function App() {
//   const [theme] = useTheme();
//   return (
//     <ThemeProvider specifiedTheme={theme} themeAction="api/set-theme">
//       <Layout>
//         <Outlet />
//         <Scripts />
//       </Layout>
//     </ThemeProvider>
//   );
// }

// export function ErrorBoundary() {
//   const error = useRouteError();
//   // catch boundary (handles thrown responses)
//   if (isRouteErrorResponse(error)) {
//     return (
//       <Layout>
//         {" "}
//         <div className="bg-orange-500">
//           <h1 className="text-white text-2xl font-bold">
//             {error.status} Error!
//           </h1>
//           <pre>{error.data.message}</pre>
//         </div>
//       </Layout>
//     );
//   }
//   // if we make it here, there is an error (thrown error)
//   if (error instanceof Error) {
//     return <Layout>{error.message}</Layout>;
//   }
//   return (
//     <Layout>
//       <div className="bg-red-500">
//         <h1 className="text-white text-2xl font-bold">Unknown Error!</h1>
//         <pre>{JSON.stringify(error)}</pre>
//       </div>
//     </Layout>
//   );
// }
