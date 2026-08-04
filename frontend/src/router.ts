import { routeTree } from './routeTree.gen';
import { createRouter } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },
  scrollRestoration: true,
  defaultPreload: 'intent',
  // Below is so Tanstack Query can manage loading/caching
  defaultPreloadStaleTime: 0,
});
