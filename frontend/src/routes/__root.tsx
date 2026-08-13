import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useMatches,
} from '@tanstack/react-router';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { QueryClient } from '@tanstack/react-query';
import Navbar from '../components/ui/Navbar';
import type { AuthState } from '../auth/types';

export interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        name: 'description',
        content:
          'Bourbon Nook is your one-stop-shop for managing your whiskey collection and reviews.',
      },
      {
        title: 'Bourbon Nook',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const showNavbar = useMatches({
    select: (matches) => !matches.some((m) => m.staticData?.showNavbar === false),
  });
  return (
    <>
      <HeadContent />
      {showNavbar && <Navbar />}
      <Outlet />
      {import.meta.env.DEV && !import.meta.env.VITEST && (
        <TanStackDevtools
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            { name: 'TanStack Query', render: <ReactQueryDevtoolsPanel /> },
            formDevtoolsPlugin(),
          ]}
        />
      )}
    </>
  );
}
