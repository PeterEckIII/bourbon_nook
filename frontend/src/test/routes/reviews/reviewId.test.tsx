import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import {
  createMockAuthState,
  renderWithFileRoutes,
} from '../../file-route-utils';
import { customReviewsInstance } from '../../../api/axios-instance';
import type { ReviewResponseModel } from '../../../api/generated/reviews-api';
import type { BottleResponseModel } from '../../../api/generated/bottles-api';

function returnReviewResponse(): ReviewResponseModel {
  return {
    bottleId: '12345',
    setting: 'Test setting',
    reviewDate: '',
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
  };
}

function returnBottleResponse(): BottleResponseModel {
  return {
    name: 'Test bottle',
    type: 'Bourbon',
    status: 'SEALED',
    distillery: 'Test distillery',
    producer: 'Test producer',
    country: 'Test country',
    region: 'Test region',
    price: 25.99,
    age: 'NAS',
    proof: 100,
    releaseYear: 2025,
    barrelInformation: 'N/A',
    finishing: 'N/A',
    imageUrl: '',
    openDate: undefined,
    killDate: undefined,
  };
}

function renderReviewIdRouteWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/reviews/12345',
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

async function getSelectors() {
  const pageTitle = await screen.findByRole('heading', { level: 1 });
  const overallRating = await screen.findByText(/overall Rating/i);
  const valueScore = await screen.findByText(/value score/i);

  const thoughtsHeading = await screen.findByRole('heading', {
    level: 2,
    name: /thoughts/i,
  });
  const tastingNotesHeading = await screen.findByRole('heading', {
    level: 2,
    name: /^tasting notes/i,
  });
  const detailsHeading = await screen.findByRole('heading', {
    level: 2,
    name: /details/i,
  });
  const individualNotesHeading = await screen.findByRole('heading', {
    level: 2,
    name: /^notes$/i,
  });
  const viewBottleLink = await screen.findByRole('link', {
    name: /view bottle/i,
  });
  const image = await screen.findByRole('img');

  return {
    pageTitle,
    overallRating,
    valueScore,
    thoughtsHeading,
    tastingNotesHeading,
    detailsHeading,
    individualNotesHeading,
    viewBottleLink,
    image,
  };
}

vi.mock('../../../api/axios-instance', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../../api/axios-instance')>();

  return {
    ...actual,
    customReviewsInstance: vi
      .fn()
      .mockResolvedValue({ id: '12345', ...returnReviewResponse() }),
    customBottlesInstance: vi
      .fn()
      .mockResolvedValue({ id: '12345', ...returnBottleResponse() }),
  };
});

describe('Review ID route', () => {
  beforeEach(() => vi.clearAllMocks());
  it('renders the route and displays elements', async () => {
    renderReviewIdRouteWithAuth();
    const selectors = await getSelectors();
    expect(selectors.pageTitle).toBeInTheDocument();
    expect(selectors.overallRating).toBeInTheDocument();
    expect(selectors.valueScore).toBeInTheDocument();
    expect(selectors.thoughtsHeading).toBeInTheDocument();
    expect(selectors.tastingNotesHeading).toBeInTheDocument();
    expect(selectors.detailsHeading).toBeInTheDocument();
    expect(selectors.individualNotesHeading).toBeInTheDocument();
    expect(selectors.viewBottleLink).toBeInTheDocument();
  });
  it('shows the missing image fallback when imageUrl is undefined', async () => {
    const mockedReviewInstance = vi.mocked(customReviewsInstance);

    mockedReviewInstance.mockResolvedValueOnce({
      ...returnReviewResponse(),
      imageUrl: undefined,
    });

    renderReviewIdRouteWithAuth();
    const { image } = await getSelectors();

    expect(image).toHaveAttribute(
      'src',
      '/src/assets/brand/png/bottle-cancel-1024.png',
    );
  });
});
