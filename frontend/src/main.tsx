import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { AuthProvider } from './auth/auth.tsx';

const queryClient = new QueryClient();

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

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    showNavbar?: boolean;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
