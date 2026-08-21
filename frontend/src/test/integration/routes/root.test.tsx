import { describe, it, expect, vi } from 'vite-plus/test';
import { screen } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../file-route-utils';

vi.mock('../../../api/axios-instance', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api/axios-instance')>();

  return {
    ...actual,
    customBottlesInstance: vi.fn().mockResolvedValue([]),
    customReviewsInstance: vi.fn().mockResolvedValue([]),
  };
});

describe('Root route', () => {
  it('renders the navbar when showNavbar is true', async () => {
    renderWithFileRoutes({
      initialLocation: '/',
      routerContext: {
        auth: createMockAuthState({
          isAuthenticated: true,
          user: {
            id: 'user123',
            email: 'testuser@gmail.com',
            username: 'testuser',
            roles: ['ROLE_USER'],
          },
        }),
      },
    });

    expect(await screen.findByRole('navigation')).toBeInTheDocument();
  });
  it('renders no navbar when showNavbar is false', async () => {
    renderWithFileRoutes({
      initialLocation: '/login',
    });

    expect(
      await screen.findByRole('heading', { name: /log in to bourbonnook/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
