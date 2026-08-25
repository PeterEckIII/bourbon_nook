import { describe, it, expect, vi } from 'vite-plus/test';
import { screen } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from './file-route-utils';

// The authenticated home route's loader fetches bottles/reviews via
// ensureQueryData — mock both so rendering '/' doesn't fire real network
// requests.
vi.mock('../../api/generated/bottles-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/generated/bottles-api')>();
  return {
    ...actual,
    getUserBottlesQueryOptions: () => ({
      queryKey: actual.getUserBottlesQueryKey(),
      queryFn: () => Promise.resolve([]),
    }),
    useUserBottlesSuspense: () => ({ data: [] }),
  };
});

vi.mock('../../api/generated/reviews-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/generated/reviews-api')>();
  return {
    ...actual,
    getUserReviewsQueryOptions: () => ({
      queryKey: actual.getUserReviewsQueryKey(),
      queryFn: () => Promise.resolve([]),
    }),
    useUserReviewsSuspense: () => ({ data: [] }),
  };
});

describe('File Route Conventions', () => {
  it('should render the index route at the root path', async () => {
    renderWithFileRoutes({
      initialLocation: '/',
      routerContext: {
        auth: createMockAuthState({
          isAuthenticated: true,
          user: null,
        }),
      },
    });

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });
});
