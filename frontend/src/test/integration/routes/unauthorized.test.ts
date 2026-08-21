import { describe, it, expect } from 'vite-plus/test';
import { screen } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../file-route-utils';

describe('Unauthorized route', () => {
  it('renders the correct elements', async () => {
    renderWithFileRoutes({
      initialLocation: '/unauthorized',
      routerContext: {
        auth: createMockAuthState({
          user: {
            id: 'user123',
            email: 'testuser@gmail.com',
            username: 'testuser',
            roles: ['ROLE_USER'],
          },
          isAuthenticated: true,
        }),
      },
    });
    expect(await screen.findByText(/access denied/i)).toBeInTheDocument();
    expect(await screen.findByText(/your roles:/i)).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /go to dashboard/i })).toHaveAttribute(
      'href',
      '/',
    );
    expect(await screen.findByRole('link', { name: /try again/i })).toBeInTheDocument();
  });
  it("renders the correct 'try again' link href when redirect is included in URL", async () => {
    renderWithFileRoutes({
      initialLocation: '/unauthorized?redirect=/reviews',
      routerContext: {
        auth: createMockAuthState({
          user: {
            id: 'user123',
            email: 'testuser@gmail.com',
            username: 'testuser',
            roles: ['ROLE_USER'],
          },
          isAuthenticated: true,
        }),
      },
    });
    expect(await screen.findByRole('link', { name: /try again/i })).toHaveAttribute(
      'href',
      '/reviews',
    );
  });
  it("renders the correct message when a 'reason' is in the URL", async () => {
    renderWithFileRoutes({
      initialLocation: '/unauthorized?reason=insufficient_role',
      routerContext: {
        auth: createMockAuthState({
          user: {
            id: 'user123',
            email: 'testuser@gmail.com',
            username: 'testuser',
            roles: ['ROLE_USER'],
          },
          isAuthenticated: true,
        }),
      },
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /you do not have the required role to access this page./i,
    );
  });
});
