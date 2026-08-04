import { render, type RenderOptions } from '@testing-library/react';
import {
  createRouter,
  RouterProvider,
  createMemoryHistory,
} from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { vi } from 'vitest';

import { routeTree } from '../routeTree.gen';
import { AuthContext } from '../auth/context';
import type { ComponentType } from 'react';
import type { AuthState } from '../auth/types';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

export function createMockAuthState(
  overrides: Partial<AuthState> = {},
): AuthState {
  return {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    hasRole: vi.fn().mockReturnValue(false),
    hasAnyRole: vi.fn().mockReturnValue(false),
    login: vi.fn().mockResolvedValue(undefined),
    register: vi.fn().mockResolvedValue(undefined),
    changePassword: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn(),
    ...overrides,
  };
}

interface ContextType {
  auth: AuthState;
  queryClient: QueryClient;
}

export function createTestRouterFromFiles(
  initialLocation = '/',
  context: Partial<ContextType> = {},
) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
    context: {
      auth: createMockAuthState(),
      queryClient: createTestQueryClient(),
      ...context,
    },
  });
  return router;
}

interface RenderWithFileRoutesOptions extends Omit<RenderOptions, 'wrapper'> {
  initialLocation?: string;
  routerContext?: Partial<ContextType>;
}

export function renderWithFileRoutes({
  initialLocation = '/',
  routerContext = {},
  ...renderOptions
}: RenderWithFileRoutesOptions = {}) {
  const auth = routerContext.auth ?? createMockAuthState();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
    context: {
      queryClient: createTestQueryClient(),
      ...routerContext,
      auth,
    },
  });

  return {
    ...render(
      <AuthContext.Provider value={auth}>
        <RouterProvider router={router} />
      </AuthContext.Provider>,
      renderOptions,
    ),
  };
}

export function createMockFileRoute(path: string, component: ComponentType) {
  return {
    path,
    component,
  };
}
