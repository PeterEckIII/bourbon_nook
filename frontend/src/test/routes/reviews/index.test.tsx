import { describe, it, expect, vi } from 'vite-plus/test';
import { screen } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import {
  useUserReviewsSuspense,
  type ReviewResponseModel,
} from '../../../api/generated/reviews-api';

const mockReviews: ReviewResponseModel[] = [
  {
    bottleId: '12345',
    setting: 'Test setting',
    reviewDate: '2026-08-10',
    restTimeMin: 15,
    glassware: 'Test glassware',
    nose: 'Test nose notes',
    palate: 'Test palate notes',
    finish: 'Test finish notes',
    thoughts: 'Test final thoughts',
    valueScore: 8,
    overallRating: 8,
    reviewNotes: [
      {
        noteId: 'abcde',
        noteName: 'chocolate',
        categoryId: 'fghjkl',
        categoryName: 'sweet',
        score: 7.5,
      },
    ],
  },
];

function renderReviewsRouteWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/reviews',
    routerContext: {
      auth: createMockAuthState({
        user: {
          id: '123abc',
          email: 'test@email.com',
          username: 'testuser',
          roles: ['ROLE_USER'],
        },
        isAuthenticated: true,
      }),
    },
  });
}

vi.mock('../../../api/generated/reviews-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api/generated/reviews-api')>();

  return {
    ...actual,
    getUserReviewsQueryOptions: () => ({
      queryKey: actual.getUserReviewsQueryKey,
      queryFn: () => Promise.resolve([]),
    }),
    useUserReviewsSuspense: vi.fn(),
  };
});

describe('Review index route', () => {
  it('shows the empty state when there are no reviews', async () => {
    vi.mocked(useUserReviewsSuspense).mockReturnValue({
      data: [],
    } as ReturnType<typeof useUserReviewsSuspense>);

    renderReviewsRouteWithAuth();

    expect(await screen.findByText(/your reviews/i)).toBeInTheDocument();
    expect(await screen.findByText(/no reviews yet/i)).toBeInTheDocument();

    expect(await screen.findByRole('link', { name: /add one/i })).toBeInTheDocument();
  });
  it('shows reviews when the collection has data', async () => {
    vi.mocked(useUserReviewsSuspense).mockReturnValue({
      data: mockReviews,
    } as ReturnType<typeof useUserReviewsSuspense>);

    renderReviewsRouteWithAuth();

    // TODO: Implement reviews table first
    // expect(await screen.findByText(''));
  });
});
