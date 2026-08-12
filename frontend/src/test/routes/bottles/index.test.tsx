import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import {
  createMockAuthState,
  renderWithFileRoutes,
} from '../../file-route-utils';
import {
  useUserBottlesSuspense,
  type BottleResponseModel,
} from '../../../api/generated/bottles-api';

const mockBottles: BottleResponseModel[] = [
  {
    name: 'Mock Bottle',
    type: 'Bourbon',
    status: 'OPENED',
    distillery: 'Mock Distillery',
    producer: 'Mock Producer',
    country: 'USA',
    region: 'KY',
    price: 25.99,
    age: 'NAS',
    proof: 115.2,
    releaseYear: 2026,
    barrelInformation: 'N/A',
    finishing: 'N/A',
    imageUrl: 'N/A',
    openDate: '2026-07-29',
    killDate: undefined,
  },
];

vi.mock('../../../api/generated/bottles-api', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../../api/generated/bottles-api')>();
  return {
    ...actual,
    getUserBottlesQueryOptions: () => ({
      queryKey: actual.getUserBottlesQueryKey(),
      queryFn: () => Promise.resolve([]),
    }),
    useUserBottlesSuspense: vi.fn(),
  };
});

function renderBottlesRoute() {
  return renderWithFileRoutes({
    initialLocation: '/bottles',
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

describe('Bottle index route', () => {
  it('shows the empty state when there are no bottles', async () => {
    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: [],
    } as ReturnType<typeof useUserBottlesSuspense>);

    renderBottlesRoute();

    expect(await screen.findByText(/your collection/i)).toBeInTheDocument();
    expect(await screen.findByText(/no bottles yet\./i)).toBeInTheDocument();
    expect(
      await screen.findByRole('link', { name: /add one/i }),
    ).toBeInTheDocument();
  });

  it('shows bottles when the collection has data', async () => {
    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: mockBottles,
    } as ReturnType<typeof useUserBottlesSuspense>);

    renderBottlesRoute();

    expect(await screen.findByText(/your collection/i)).toBeInTheDocument();
    expect(await screen.findByText('Mock Bottle')).toBeInTheDocument();
    expect(
      await screen.findByRole('link', { name: /edit bottle/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/no bottles yet\./i)).not.toBeInTheDocument();
  });
});
