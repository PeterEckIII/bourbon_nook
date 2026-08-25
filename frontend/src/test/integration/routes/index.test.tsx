import { describe, it, expect, vi } from 'vite-plus/test';
import { screen } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../file-route-utils';
import {
  useUserBottlesSuspense,
  type BottleResponseModel,
} from '../../../api/generated/bottles-api';
import {
  useUserReviewsSuspense,
  type ReviewResponseModel,
} from '../../../api/generated/reviews-api';

const mockBottles: BottleResponseModel[] = [
  {
    id: '1',
    name: 'Mock Bottle',
    type: 'Bourbon',
    status: 'OPENED',
    region: 'KY',
    price: 45,
    createdAt: '2026-03-05',
  },
];

const mockReviews: ReviewResponseModel[] = [
  {
    id: '1',
    bottleId: '1',
    reviewDate: '2026-03-10',
    overallRating: 8,
    reviewNotes: [{ categoryName: 'Vanilla', score: 7 }],
  },
];

vi.mock('../../../api/generated/bottles-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api/generated/bottles-api')>();
  return {
    ...actual,
    getUserBottlesQueryOptions: () => ({
      queryKey: actual.getUserBottlesQueryKey(),
      queryFn: () => Promise.resolve([]),
    }),
    useUserBottlesSuspense: vi.fn(),
  };
});

vi.mock('../../../api/generated/reviews-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api/generated/reviews-api')>();
  return {
    ...actual,
    getUserReviewsQueryOptions: () => ({
      queryKey: actual.getUserReviewsQueryKey(),
      queryFn: () => Promise.resolve([]),
    }),
    useUserReviewsSuspense: vi.fn(),
  };
});

function renderHomeRoute() {
  return renderWithFileRoutes({
    initialLocation: '/',
    routerContext: {
      auth: createMockAuthState({
        user: { id: '123abc', email: 'test@email.com', username: 'testuser', roles: ['ROLE_USER'] },
        isAuthenticated: true,
      }),
    },
  });
}

describe('Dashboard (home) route', () => {
  it('shows empty states when there is no data', async () => {
    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: [],
    } as ReturnType<typeof useUserBottlesSuspense>);
    vi.mocked(useUserReviewsSuspense).mockReturnValue({
      data: [],
    } as ReturnType<typeof useUserReviewsSuspense>);

    renderHomeRoute();

    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
    expect(await screen.findByText('Total Bottles')).toBeInTheDocument();
    expect(screen.getAllByText(/no data yet\./i).length).toBeGreaterThan(0);
  });

  it('links out to the full bottles and reviews lists', async () => {
    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: [],
    } as ReturnType<typeof useUserBottlesSuspense>);
    vi.mocked(useUserReviewsSuspense).mockReturnValue({
      data: [],
    } as ReturnType<typeof useUserReviewsSuspense>);

    renderHomeRoute();

    const bottlesLink = await screen.findByRole('link', { name: /view all bottles/i });
    expect(bottlesLink).toHaveAttribute('href', '/bottles');
    const reviewsLink = await screen.findByRole('link', { name: /view all reviews/i });
    expect(reviewsLink).toHaveAttribute('href', '/reviews');
  });

  it('shows computed stats and charts when there is data', async () => {
    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: mockBottles,
    } as ReturnType<typeof useUserBottlesSuspense>);
    vi.mocked(useUserReviewsSuspense).mockReturnValue({
      data: mockReviews,
    } as ReturnType<typeof useUserReviewsSuspense>);

    renderHomeRoute();

    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
    expect(await screen.findByText('$45.00')).toBeInTheDocument();
    expect(await screen.findByText('8.0')).toBeInTheDocument();
    expect(screen.queryByText(/no data yet\./i)).not.toBeInTheDocument();
  });
});
